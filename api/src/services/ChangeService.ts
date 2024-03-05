import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Change, ChangeCursor, ChangePage, SyncType } from 'models/Change';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { PropertyService } from './PropertyService';
import { WordService } from './WordService';
import { LanguageService } from './LanguageService';
import { ChronologicalCursor, WordOrder } from 'models/Word';
import { Direction } from 'models/Page';
import { ChangeBuilder } from './ChangeBuilder';

const DEFAULT_LIMIT = 100;

export interface GetChangePageParams {
  syncType?: SyncType;
  changedAt?: DateTime;
  cursor?: ChangeCursor;
  limit?: number;
  excludeClientId?: string;
}

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
  ) {}

  async getPage(params: GetChangePageParams): Promise<ChangePage> {
    const syncType = await this.determineSyncType(params);
    params.limit = params.limit ?? DEFAULT_LIMIT;

    if (syncType === SyncType.Delta) {
      return await this.getDeltaPage(params);
    } else {
      return await this.getFullPage(params);
    }
  }

  async create(change: Change): Promise<void> {
    await this.changeRepository.create(change);
  }

  private async determineSyncType(
    params: GetChangePageParams,
  ): Promise<SyncType> {
    let syncType = SyncType.Full;
    if (params.syncType === SyncType.Delta && params.changedAt) {
      const oldestChangeAt = await this.changeRepository.getOldestChangedAt();
      if (oldestChangeAt && oldestChangeAt <= params.changedAt) {
        syncType = SyncType.Delta;
      }
    }
    return syncType;
  }

  private async getDeltaPage(params: GetChangePageParams): Promise<ChangePage> {
    return await this.changeRepository.getPage(params);
  }

  private async getFullPage(params: GetChangePageParams): Promise<ChangePage> {
    const wordsPage = await this.wordService.getPage({
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
    const nextCursor = wordsPage.nextCursor as ChronologicalCursor;

    const changes: ChangePage = {
      items: wordsPage.items.map((word) =>
        this.changeBuilder.buildCreateWordChange(word),
      ),
      ...(nextCursor && {
        nextCursor: {
          changedAt: nextCursor.addedAt,
          id: nextCursor.id,
        },
      }),
      syncType: SyncType.Full,
    };

    if (!params.cursor) {
      const [languages, properties] = await Promise.all([
        this.languageService.getAll(),
        this.propertyService.getAll(),
      ]);

      changes.items = [
        ...languages.map((language) =>
          this.changeBuilder.buildCreateLanguageChange(language),
        ),
        ...properties.map((property) =>
          this.changeBuilder.buildCreatePropertyChange(property),
        ),
        ...changes.items,
      ];
    }

    return changes;
  }
}
