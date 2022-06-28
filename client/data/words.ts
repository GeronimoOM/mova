import { v4 as uuid } from 'uuid';

export interface Word {
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
}

export enum PartOfSpeech {
    Noun,
    Verb,
    Adjective,
    Adverb,
    Misc,
}

export const words: Word[] = [
    {
        id: uuid(),
        original: 'päike',
        translation: 'sun',
        partOfSpeech: PartOfSpeech.Noun,
    },
    {
        id: uuid(),
        original: 'koer',
        translation: 'dog',
        partOfSpeech: PartOfSpeech.Noun,
    },
    {
        id: uuid(),
        original: 'maja',
        translation: 'house',
        partOfSpeech: PartOfSpeech.Noun,
    },
    {
        id: uuid(),
        original: 'laulma',
        translation: 'to sing',
        partOfSpeech: PartOfSpeech.Verb,
    },
    {
        id: uuid(),
        original: 'hea',
        translation: 'good',
        partOfSpeech: PartOfSpeech.Adjective,
    },
];
