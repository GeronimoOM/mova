import { Type } from '@nestjs/common';
import {
  ArgsType,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Direction, Page } from 'models/Page';
import { DEFAULT_LIMIT } from 'utils/constants';

registerEnumType(Direction, {
  name: 'Direction',
});

export function pageType<T>(
  typeName: string,
  classRef: Type<T>,
): Type<Page<T, string>> {
  @ObjectType(`${typeName}Page`)
  abstract class PageType {
    @Field(() => [classRef])
    items: T[];

    @Field({ nullable: true })
    nextCursor?: string;
  }

  return PageType as Type<Page<T, string>>;
}

@ArgsType()
export class PageArgsType {
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_LIMIT })
  limit: number;
}
