import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { pageType } from './PageType';
import { TopicId } from 'models/Topic';
import { LanguageId } from 'models/Language';

@ObjectType('Topic')
export class TopicType {
  @Field((type) => ID)
  id: TopicId;

  @Field()
  name: string;

  languageId: LanguageId;
}

export const TopicPageType = pageType('Topic', TopicType);

@InputType()
export class CreateTopicInput {
  @Field()
  name: string;

  @Field((type) => ID)
  languageId: LanguageId;
}
