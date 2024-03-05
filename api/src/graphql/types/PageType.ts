import {
  Field,
  ObjectType,
  Int,
  ArgsType,
  registerEnumType,
} from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { Direction, Page } from 'models/Page';

registerEnumType(Direction, {
  name: 'Direction',
});

export function pageType<T>(
  typeName: string,
  classRef: Type<T>,
): Type<Page<T, string>> {
  @ObjectType(`${typeName}Page`)
  abstract class PageType {
    @Field((type) => [classRef])
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

  @Field((type) => Int, { nullable: true })
  limit?: number;
}
