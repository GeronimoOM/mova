import { GraphQLClient } from 'graphql-request';
import { Language, PartOfSpeech, Property, Page, Word, CreateLanguageInput, UpdateLanguageInput, CreatePropertyInput, UpdatePropertyInput, CreateWordInput, UpdateWordInput } from '../types';
import { GQL_CREATE_LANGUAGE, GQL_CREATE_PROPERTY, GQL_CREATE_WORD, GQL_DELETE_WORD, GQL_UPDATE_LANGUAGE, GQL_UPDATE_PROPERTY, GQL_UPDATE_WORD } from './mutations';
import { GQL_GET_LANGUAGES, GQL_GET_PROPERTIES, GQL_GET_WORDS } from './queries';

//TODO extract to config
const GRAPHQL_API_URL = 'http://localhost:9000/graphql';

export const graphQlClient = new GraphQLClient(GRAPHQL_API_URL);

export async function fetchLanguages(): Promise<Language[]> {
    const { languages } = await graphQlClient.request(GQL_GET_LANGUAGES);
    return languages;
}

export async function createLanguage(input: CreateLanguageInput): Promise<Language> {
    const { createLanguage } = await graphQlClient.request(GQL_CREATE_LANGUAGE, { input });
    return createLanguage;
}

export async function updateLanguage(input: UpdateLanguageInput): Promise<Language> {
    const { updateLanguage } = await graphQlClient.request(GQL_UPDATE_LANGUAGE, { input });
    return updateLanguage;
}


export interface FetchPropertiesParams {
    languageId: string;
    partOfSpeech?: PartOfSpeech;
}

export async function fetchProperties(params: FetchPropertiesParams): Promise<Property[]> {
    const { language: { properties } } = await graphQlClient.request(GQL_GET_PROPERTIES, params)
    return properties;
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
    const { createProperty } = await graphQlClient.request(GQL_CREATE_PROPERTY, { input })
    return createProperty;
}

export async function updateProperty(input: UpdatePropertyInput): Promise<Property> {
    const { updateProperty } = await graphQlClient.request(GQL_UPDATE_PROPERTY, { input })
    return updateProperty;
}

export interface FetchWordsParams {
   languageId: string;
   start?: number;
   limit?: number;
   query?: string;
   order?: 'Alphabetical' | 'Chronological';
}

export async function fetchWords(params: FetchWordsParams): Promise<Page<Word>> {
    const { language: { words } } = await graphQlClient.request(GQL_GET_WORDS, params);
    return words;
}

export async function createWord(input: CreateWordInput): Promise<Word> {
    const { createWord } = await graphQlClient.request(GQL_CREATE_WORD, { input });
    return createWord;
}

export async function updateWord(input: UpdateWordInput): Promise<Word> {
    const { updateWord } = await graphQlClient.request(GQL_UPDATE_WORD, { input });
    return updateWord;
}

export async function deleteWord(wordId: string): Promise<void> {
    await graphQlClient.request(GQL_DELETE_WORD, { id: wordId });
}