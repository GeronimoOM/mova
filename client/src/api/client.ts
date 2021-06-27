import {
  Page,
  Language,
  Entry,
  Property,
  PartOfSpeech,
  EntryFull,
} from './types';

const API = 'http://localhost:9000/api';
const ENTRIES_PER_PAGE = 10;

export async function getLanguages(): Promise<Page<Language>> {
  const response = await fetch(`${API}/langs`);
  return response.json();
}

export async function getLanguageEntries(
  langId: string,
  start = 0,
  limit = ENTRIES_PER_PAGE,
): Promise<Page<Entry>> {
  const response = await fetch(
    `${API}/entries?langId=${langId}&start=${start}&limit=${limit}`,
  );
  return response.json();
}

export async function getEntryProperties(entryId: string): Promise<Property[]> {
  const response = await fetch(`${API}/entries/${entryId}/definitions`);
  return response.json();
}

export async function getEntry(entryId: string): Promise<EntryFull> {
  const response = await fetch(`${API}/entries/${entryId}`);
  return response.json();
}

export async function getLanguageProperties(
  langId: string,
  partOfSpeech?: PartOfSpeech,
): Promise<Page<Property>> {
  const url = new URL(`${API}/definitions`);
  const params: any = { langId };
  if (partOfSpeech) {
    params.partOfSpeech = partOfSpeech;
  }
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString());
  return response.json();
}

export interface CreateEntryParams {
  original: string;
  translation: string;
  langId: string;
  partOfSpeech: PartOfSpeech;
  customValues?: SaveEntryPropertyValues;
}

export type SaveEntryPropertyValues = Record<string, SaveEntryPropertyValue>;

export interface SaveEntryPropertyValue {
  text?: string;
  option?: string;
  options?: string[];
}

export async function createEntry(
  createEntry: CreateEntryParams,
): Promise<EntryFull> {
  const response = await fetch(`${API}/entries`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createEntry),
  });
  return response.json();
}

export interface UpdateEntryParams {
  original?: string;
  translation?: string;
  customValues?: SaveEntryPropertyValues;
}

export async function updateEntry(
  updateEntry: UpdateEntryParams,
  entryId: string,
): Promise<EntryFull> {
  const response = await fetch(`${API}/entries/${entryId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateEntry),
  });
  return response.json();
}

export async function deleteEntry(entry: Entry): Promise<Entry> {
  const response = await fetch(`${API}/entries/${entry.id}`, {
    method: 'delete',
  });
  return response.json();
}

export interface CreatePropertyParams {
  name: string;
  type: string;
  langId: string;
  partOfSpeech: PartOfSpeech;
  options?: string[];
}

export async function createProperty(
  createProperty: CreatePropertyParams,
): Promise<Property> {
  const response = await fetch(`${API}/definitions`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createProperty),
  });
  return response.json();
}

export interface UpdatePropertyParams {
  name?: string;
  text?: string;
  options?: Record<string, string>;
}

export async function updateProperty(
  updateProperty: UpdatePropertyParams,
  propId: string,
): Promise<Property> {
  const response = await fetch(`${API}/definitions/${propId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateProperty),
  });
  return response.json();
}
