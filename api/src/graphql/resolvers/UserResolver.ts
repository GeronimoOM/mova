import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  UpdateUserSettingsInput,
  UserSettingsType,
} from 'graphql/types/UserSettingsType';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { UserService } from 'services/UserService';

@Resolver(() => UserSettingsType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserSettingsType)
  async settings(@ContextDec() ctx: Context): Promise<UserSettingsType> {
    return await this.userService.getSettings(ctx.user.id);
  }

  @Mutation(() => UserSettingsType)
  async updateSettings(
    @ContextDec() ctx: Context,
    @Args('input') input: UpdateUserSettingsInput,
  ): Promise<UserSettingsType> {
    return await this.userService.updateSettings(ctx.user.id, input);
  }
}
