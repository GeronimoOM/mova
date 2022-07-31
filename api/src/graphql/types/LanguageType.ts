import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType('Language')
export class LanguageType {
    @Field((type) => ID)
    id: string;

    @Field()
    name: string;
}
