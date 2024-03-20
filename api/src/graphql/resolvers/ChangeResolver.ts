import {
  Args,
  Context as ContextDec,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { PropertyTypeMapper } from 'graphql/mappers/PropertyTypeMapper';
import { WordTypeMapper } from 'graphql/mappers/WordTypeMapper';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import {
  ChangePageType,
  ChangeUnionType,
  ApplyChangeInput,
} from 'graphql/types/ChangeType';
import { PageArgsType } from 'graphql/types/PageType';
import { DateTime } from 'luxon';
import { ChangeCursor, SyncType } from 'models/Change';
import { Context } from 'models/Context';
import { ChangeService } from 'services/ChangeService';
import { decodeCursor, encodeCursor } from 'utils/cursors';

@Resolver((of) => ChangeUnionType)
export class ChangeResolver {
  constructor(
    private changeService: ChangeService,
    private changeTypeMapper: ChangeTypeMapper,
    private propertyTypeMapper: PropertyTypeMapper,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query((type) => ChangePageType)
  async changes(
    @ContextDec('ctx') ctx: Context,
    @Args() pageArgs: PageArgsType,
    @Args('syncType', { type: () => SyncType, nullable: true })
    syncType?: SyncType,
    @Args('changedAt', { type: () => TimestampScalar, nullable: true })
    changedAt?: DateTime,
  ): Promise<ChangePageType> {
    const changePage = await this.changeService.getPage({
      syncType,
      changedAt,
      cursor: pageArgs.cursor
        ? decodeCursor(pageArgs.cursor, ChangeCursor)
        : null,
      limit: pageArgs.limit,
      excludeClientId: ctx.clientId,
    });

    return {
      items: changePage.items.map((change) =>
        this.changeTypeMapper.map(change),
      ),
      nextCursor: changePage.nextCursor
        ? encodeCursor(changePage.nextCursor)
        : null,
      syncType: changePage.syncType,
    };
  }

  @Mutation((returns) => Boolean)
  async applyChanges(
    @ContextDec('ctx') ctx: Context,
    @Args('changes', { type: () => [ApplyChangeInput] })
    changes: ApplyChangeInput[],
  ): Promise<boolean> {
    await this.changeService.apply(
      ctx,
      changes.map((change) => ({
        ...change,
        ...(change.updateProperty && {
          updateProperty: this.propertyTypeMapper.mapFromUpdateInput(
            change.updateProperty,
          ),
        }),
        ...(change.createWord && {
          createWord: this.wordTypeMapper.mapFromCreateInput(change.createWord),
        }),
        ...(change.updateWord && {
          updateWord: this.wordTypeMapper.mapFromUpdateInput(change.updateWord),
        }),
      })),
    );

    return true;
  }
}
