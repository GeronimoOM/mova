import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { LanguageId } from 'models/Language';

@ObjectType('UserSettings')
export class UserSettingsType {
  @Field(() => ID, { nullable: true })
  selectedLanguageId?: LanguageId;

  @Field({ nullable: true })
  selectedLocale?: string;

  @Field({ nullable: true })
  selectedFont?: string;

  @Field({ nullable: true })
  includeMastered?: boolean;
}

@InputType()
export class UpdateUserSettingsInput {
  @Field(() => ID, { nullable: true })
  selectedLanguageId?: LanguageId;

  @Field({ nullable: true })
  selectedLocale?: string;

  @Field({ nullable: true })
  selectedFont?: string;

  @Field({ nullable: true })
  includeMastered?: boolean;
}
