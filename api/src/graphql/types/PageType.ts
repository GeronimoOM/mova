import { Field, ObjectType, Int, ArgsType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { Page } from 'models/Page';

export function pageType<T>(
  typeName: string,
  classRef: Type<T>,
): Type<Page<T>> {
  @ObjectType(`${typeName}Page`)
  abstract class PageType {
    @Field((type) => [classRef])
    items: T[];

    @Field({ nullable: true })
    nextCursor?: string;
  }

  return PageType as Type<Page<T>>;
}

@ArgsType()
export class PageArgsType {
  @Field({ nullable: true })
  cursor?: string;

  @Field((type) => Int, { nullable: true })
  limit?: number;
}
