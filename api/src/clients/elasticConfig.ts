import * as elastic from '@elastic/elasticsearch/lib/api/types';

export const INDEX_WORDS = 'words';
export const INDEX_TOPICS = 'topics';

export const INDICES = [INDEX_WORDS, INDEX_TOPICS];

export type IndexType = (typeof INDICES)[number];

export const INDEX_TO_MAPPING: Record<IndexType, elastic.MappingTypeMapping> = {
  [INDEX_WORDS]: {
    properties: {
      original: {
        type: 'text',
        boost: 1.5,
      },
      translation: {
        type: 'text',
      },
      properties: {
        type: 'text',
      },
      languageId: {
        type: 'keyword',
      },
      partOfSpeech: {
        type: 'keyword',
      },
      topics: {
        type: 'keyword',
      },
    },
  },

  [INDEX_TOPICS]: {
    properties: {
      name: {
        type: 'text',
      },
    },
  },
};

export const INDEX_SETTINGS: elastic.IndicesIndexSettings = {
  analysis: {
    analyzer: {
      default: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'custom_asciifolding'],
      },
    },
    filter: {
      custom_asciifolding: {
        type: 'asciifolding',
        preserve_original: true,
      },
    },
  },
};
