import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PartOfSpeech, WordId, WordOrder } from 'models/Word';
import { pageType } from './PageType';
import { PropertyValueUnionType } from './PropertyValueType';
import { LanguageId } from 'models/Language';

registerEnumType(PartOfSpeech, {
    name: 'PartOfSpeech',
});

@ObjectType('Word')
export class WordType {
    @Field()
    id: WordId;

    @Field()
    original: string;

    @Field()
    translation: string;

    @Field((type) => PartOfSpeech)
    partOfSpeech: PartOfSpeech;

    @Field((type) => [PropertyValueUnionType])
    properties: Array<typeof PropertyValueUnionType>;

    languageId: LanguageId;
}

export const WordPageType = pageType('Word', WordType);

registerEnumType(WordOrder, {
    name: 'WordOrder',
});
