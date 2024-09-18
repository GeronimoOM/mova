import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { LanguageId } from 'models/Language';

@ObjectType('UserSettings')
export class UserSettingsType {
  @Field((type) => ID, { nullable: true })
  selectedLanguageId?: LanguageId;

  @Field({ nullable: true })
  selectedLocale?: string;
}

@InputType()
export class UpdateUserSettingsInput {
  @Field((type) => ID, { nullable: true })
  selectedLanguageId?: LanguageId;

  @Field({ nullable: true })
  selectedLocale?: string;
}
