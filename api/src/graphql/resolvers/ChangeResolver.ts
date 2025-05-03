import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { PropertyTypeMapper } from 'graphql/mappers/PropertyTypeMapper';
import { WordTypeMapper } from 'graphql/mappers/WordTypeMapper';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import {
  ApplyChangeInput,
  ChangePageType,
  ChangeUnionType,
} from 'graphql/types/ChangeType';
import { PageArgsType } from 'graphql/types/PageType';
import { DateTime } from 'luxon';
import { ContextDec } from 'middleware/ContextMiddleware';
import { ChangeCursor, SyncType } from 'models/Change';
import { Context } from 'models/Context';
import { ApplyChangesParams, ChangeService } from 'services/ChangeService';

import { decodeCursor, encodeCursor } from 'utils/cursors';

@Resolver(() => ChangeUnionType)
export class ChangeResolver {
  constructor(
    private changeService: ChangeService,
    private changeTypeMapper: ChangeTypeMapper,
    private propertyMapper: PropertyTypeMapper,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query(() => ChangePageType)
  async changes(
    @ContextDec() ctx: Context,
    @Args() pageArgs: PageArgsType,
    @Args('syncType', { type: () => SyncType, nullable: true })
    syncType?: SyncType,
    @Args('changedAt', { type: () => TimestampScalar, nullable: true })
    changedAt?: DateTime,
  ): Promise<ChangePageType> {
    const cursor = pageArgs.cursor
      ? decodeCursor(pageArgs.cursor, ChangeCursor)
      : null;

    const changePage = await this.changeService.getPage(ctx, {
      syncType,
      changedAt,
      ...(cursor && { cursor }),
      limit: pageArgs.limit,
      excludeClientId: ctx.clientId,
    });

    const nextCursor = changePage.nextCursor
      ? encodeCursor(changePage.nextCursor)
      : null;

    return {
      items: changePage.items.map((change) =>
        this.changeTypeMapper.map(change),
      ),
      ...(nextCursor && { nextCursor }),
      syncType: changePage.syncType,
    };
  }

  @Mutation(() => Boolean)
  async applyChanges(
    @ContextDec() ctx: Context,
    @Args('changes', { type: () => [ApplyChangeInput] })
    changes: ApplyChangeInput[],
  ): Promise<boolean> {
    await this.changeService.apply(ctx, this.mapChangeToParams(changes));

    return true;
  }

  private mapChangeToParams(changes: ApplyChangeInput[]): ApplyChangesParams {
    return changes.map((change) => ({
      ...change,
      ...(change.createProperty && {
        createProperty: this.propertyMapper.mapFromCreateInput(
          change.createProperty,
        ),
      }),
      ...(change.createWord && {
        createWord: this.wordTypeMapper.mapFromCreateInput(change.createWord),
      }),
      ...(change.updateWord && {
        updateWord: this.wordTypeMapper.mapFromUpdateInput(change.updateWord),
      }),
    }));
  }
}
