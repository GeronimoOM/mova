import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { WordId, WordLinkType } from 'models/Word';

registerEnumType(WordLinkType, {
  name: 'WordLinkType',
});

@ObjectType('WordLink')
export class WordLinkObjectType {
  @Field(() => ID)
  word1Id: WordId;

  @Field(() => ID)
  word2Id: WordId;

  @Field(() => WordLinkType)
  type: WordLinkType;
}

@InputType()
export class CreateWordLinkInput {
  @Field(() => ID)
  word1Id: WordId;

  @Field(() => ID)
  word2Id: WordId;

  @Field(() => WordLinkType)
  type: WordLinkType;
}

@InputType()
export class DeleteWordLinkInput {
  @Field(() => ID)
  word1Id: WordId;

  @Field(() => ID)
  word2Id: WordId;

  @Field(() => WordLinkType)
  type: WordLinkType;
}
