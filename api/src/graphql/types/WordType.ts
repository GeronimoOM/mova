import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PartOfSpeech, WordOrder } from 'src/models/Word';
import { pageType } from './PageType';
import { PropertyValueUnionType } from './PropertyValueType';

registerEnumType(PartOfSpeech, {
    name: 'PartOfSpeech',
});

@ObjectType('Word')
export class WordType {
    @Field()
    id: string;

    @Field()
    original: string;

    @Field()
    translation: string;

    @Field((type) => PartOfSpeech)
    partOfSpeech: PartOfSpeech;

    @Field((type) => [PropertyValueUnionType])
    properties: Array<typeof PropertyValueUnionType>;
}

export const WordPageType = pageType('Word', WordType);

registerEnumType(WordOrder, {
    name: 'WordOrder',
});
