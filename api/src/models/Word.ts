import { Flavor } from 'src/utils/flavor';
import { LanguageId } from './Language';
import { PropertyId } from './Property';
import { PropertyValue } from './PropertyValue';

export type WordId = Flavor<string, 'Word'>;

export interface Word {
    id: WordId;
    original: string;
    translation: string;
    languageId: LanguageId;
    partOfSpeech: PartOfSpeech;
    properties?: Map<PropertyId, PropertyValue>;
}

export enum PartOfSpeech {
    Noun = 'noun',
    Verb = 'verb',
    Adj = 'adj',
    Adv = 'adv',
    Pron = 'pron',
    Misc = 'misc',
}

export enum WordOrder {
    Alphabetical = 'alphabetical',
    Chronological = 'chronolocial',
}
