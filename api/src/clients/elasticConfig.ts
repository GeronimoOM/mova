import * as elastic from '@elastic/elasticsearch/lib/api/types';

export const INDEX_WORDS = 'words';

export const INDICES = [INDEX_WORDS];

export type IndexType = (typeof INDICES)[number];

export const INDEX_TO_MAPPING: Record<IndexType, elastic.MappingTypeMapping> = {
  [INDEX_WORDS]: {
    properties: {
      original: {
        type: 'text',
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
