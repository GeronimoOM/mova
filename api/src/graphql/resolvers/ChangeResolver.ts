import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { ChangePageType, ChangeUnionType } from 'graphql/types/ChangeType';
import { PageArgsType } from 'graphql/types/PageType';
import { DateTime } from 'luxon';
import { ChangeCursor, SyncType } from 'models/Change';
import { ChangeService } from 'services/ChangeService';
import { decodeCursor, encodeCursor } from 'utils/cursors';

@Resolver((of) => ChangeUnionType)
export class ChangeResolver {
  constructor(
    private changeService: ChangeService,
    private changeTypeMapper: ChangeTypeMapper,
  ) {}

  @Query((type) => ChangePageType)
  async changes(
    @Args() pageArgs: PageArgsType,
    @Args('syncType', { type: () => SyncType, nullable: true })
    syncType?: SyncType,
    @Args('changedAt', { type: () => TimestampScalar, nullable: true })
    changedAt?: DateTime,
    @Args('clientId', { nullable: true })
    clientId?: string,
  ): Promise<ChangePageType> {
    const changePage = await this.changeService.getPage({
      syncType,
      changedAt,
      cursor: pageArgs.cursor
        ? decodeCursor(pageArgs.cursor, ChangeCursor)
        : null,
      limit: pageArgs.limit,
      excludeClientId: clientId,
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
}
