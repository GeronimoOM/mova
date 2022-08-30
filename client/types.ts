export interface Language {
    id: string;
    name: string;
}

export type Property = TextProperty | OptionProperty;

export interface BaseProperty {
    id: string;
    name: string;
    type: PropertyType;
    partOfSpeech: PartOfSpeech;
}

export interface TextProperty extends BaseProperty {
    type: PropertyType.Text;
}

export interface OptionProperty extends BaseProperty {
    type: PropertyType.Option;
    options: Option[];
}

export interface Option {
    id: string;
    value: string;
}

export enum PropertyType {
    Text = 'Text',
    Option = 'Option',
}

export interface Word {
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
    properties?: PropertyValue[];
}

export enum PartOfSpeech {
    Noun = 'Noun',
    Verb = 'Verb',
    Adjective = 'Adj',
    Adverb = 'Adv',
    Pronoun = 'Pron',
    Misc = 'Misc',
}

export type PropertyValue = TextPropertyValue |  OptionPropertyValue;

export interface TextPropertyValue {
    property: TextProperty;
    text: string;
}

export interface OptionPropertyValue {
    property: OptionProperty;
    option: Option;
}

export type Page<T> = {
    items: T[];
    hasMore: boolean;
}

export interface CreateLanguageInput {
    name: string;
}

export interface UpdateLanguageInput {
    id: string;
    name: string;
}

export interface CreatePropertyInput {
    name: string;
    type: PropertyType;
    languageId: string;
    partOfSpeech: PartOfSpeech;
    options?: string[];
}

export interface UpdatePropertyInput {
    id: string;
    name?: string;
    options?: UpdateOptionInput[];
}

export interface UpdateOptionInput {
    id: string;
    name: string;
}

export interface CreateWordInput {
    original: string;
    translation: string;
    languageId: string;
    partOfSpeech: PartOfSpeech;
    properties?: UpdatePropertyValueInput[];
}

export interface UpdateWordInput {
    id: string;
    original?: string;
    translation?: string;
    properties?: UpdatePropertyValueInput[];
}

export interface UpdatePropertyValueInput {
    id: string;
    text?: string;
    option?: string;
}

