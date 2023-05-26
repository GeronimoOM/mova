import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LanguageId } from 'models/Language';

@ObjectType('Language')
export class LanguageType {
  @Field((type) => ID)
  id: LanguageId;

  @Field()
  name: string;
}
