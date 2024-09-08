import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { Change, ChangeCursor, ChangePage, SyncType } from 'models/Change';
import { Context } from 'models/Context';
import { Direction, mapCursor, mapPage } from 'models/Page';
import { ChronologicalCursor, WordOrder } from 'models/Word';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { ChangeBuilder } from './ChangeBuilder';
import {
  CreateLanguageParams,
  DeleteLanguageParams,
  LanguageService,
  UpdateLanguageParams,
} from './LanguageService';
import {
  CreatePropertyParams,
  DeletePropertyParams,
  PropertyService,
  ReorderPropertiesParams,
  UpdatePropertyParams,
} from './PropertyService';
import {
  CreateWordParams,
  DeleteWordParams,
  UpdateWordParams,
  WordService,
} from './WordService';

const DEFAULT_LIMIT = 100;

export interface GetChangePageParams {
  syncType?: SyncType;
  changedAt?: DateTime;
  cursor?: ChangeCursor;
  limit?: number;
  excludeClientId?: string;
}

export type ApplyChangesParams = Array<{
  createLanguage?: CreateLanguageParams;
  updateLanguage?: UpdateLanguageParams;
  deleteLanguage?: DeleteLanguageParams;
  createProperty?: CreatePropertyParams;
  updateProperty?: UpdatePropertyParams;
  reorderProperties?: ReorderPropertiesParams;
  deleteProperty?: DeletePropertyParams;
  createWord?: CreateWordParams;
  updateWord?: UpdateWordParams;
  deleteWord?: DeleteWordParams;
}>;

@Injectable()
export class ChangeService {
  constructor(
    private changeRepository: ChangeRepository,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => PropertyService))
    private propertyService: PropertyService,
    @Inject(forwardRef(() => WordService))
    private wordService: WordService,
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
  ) {}

  async getPage(
    ctx: Context,
    params: GetChangePageParams,
  ): Promise<ChangePage> {
    const syncType = await this.determineSyncType(ctx, params);
    params.limit = params.limit ?? DEFAULT_LIMIT;

    if (syncType === SyncType.Delta) {
      return await this.getDeltaPage(ctx, params);
    } else {
      return await this.getFullPage(ctx, params);
    }
  }

  async create(change: Change): Promise<void> {
    await this.changeRepository.create(change);
  }

  async apply(ctx: Context, changes: ApplyChangesParams): Promise<void> {
    await this.connectionManager.transactionally(async () => {
      for (const change of changes) {
        if (change.createLanguage) {
          await this.languageService.create(ctx, change.createLanguage);
        } else if (change.updateLanguage) {
          await this.languageService.update(ctx, change.updateLanguage);
        } else if (change.deleteLanguage) {
          await this.languageService.delete(ctx, change.deleteLanguage);
        } else if (change.createProperty) {
          await this.propertyService.create(ctx, change.createProperty);
        } else if (change.updateProperty) {
          await this.propertyService.update(ctx, change.updateProperty);
        } else if (change.reorderProperties) {
          await this.propertyService.reorder(ctx, change.reorderProperties);
        } else if (change.deleteProperty) {
          await this.propertyService.delete(ctx, change.deleteProperty);
        } else if (change.createWord) {
          await this.wordService.create(ctx, change.createWord);
        } else if (change.updateWord) {
          await this.wordService.update(ctx, change.updateWord);
        } else if (change.deleteWord) {
          await this.wordService.delete(ctx, change.deleteWord);
        }
      }
    });
  }

  // every day a 1am
  @Cron('0 0 1 * * *', {
    utcOffset: 0,
  })
  async cleanupChanges() {
    Logger.log('Cleaning up old changes...');
    await this.changeRepository.deleteOlder(DateTime.utc().minus({ weeks: 3 }));
  }

  private async determineSyncType(
    ctx: Context,
    params: GetChangePageParams,
  ): Promise<SyncType> {
    let syncType = SyncType.Full;
    if (params.syncType === SyncType.Delta && params.changedAt) {
      const oldestChangeAt = await this.changeRepository.getOldestChangedAt(
        ctx.user.id,
      );
      if (oldestChangeAt && oldestChangeAt <= params.changedAt) {
        syncType = SyncType.Delta;
      }
    }
    return syncType;
  }

  private async getDeltaPage(
    ctx: Context,
    params: GetChangePageParams,
  ): Promise<ChangePage> {
    return await this.changeRepository.getPage({
      userId: ctx.user.id,
      ...params,
    });
  }

  private async getFullPage(
    ctx: Context,
    params: GetChangePageParams,
  ): Promise<ChangePage> {
    const languages = await this.languageService.getAll(ctx);
    const wordsPage = await this.wordService.getPage(ctx, {
      languageId: languages.map((language) => language.id),
      order: WordOrder.Chronological,
      direction: Direction.Asc,
      cursor: params.cursor
        ? {
            addedAt: params.cursor.changedAt,
            id: params.cursor.id,
          }
        : null,
      limit: params.limit,
    });

    const changes: ChangePage = {
      ...mapCursor(
        mapPage(wordsPage, (word) =>
          this.changeBuilder.buildCreateWordChange(ctx, word),
        ),
        (cursor: ChronologicalCursor) => ({
          changedAt: cursor.addedAt,
          id: cursor.id,
        }),
      ),
      syncType: SyncType.Full,
    };

    if (!params.cursor) {
      const [languages, properties] = await Promise.all([
        this.languageService.getAll(ctx),
        this.propertyService.getAll(ctx),
      ]);

      changes.items = [
        ...languages.map((language) =>
          this.changeBuilder.buildCreateLanguageChange(ctx, language),
        ),
        ...properties.map((property) =>
          this.changeBuilder.buildCreatePropertyChange(ctx, property),
        ),
        ...changes.items,
      ];
    }

    return changes;
  }
}
