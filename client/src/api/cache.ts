import { InMemoryCache, TypePolicy } from '@apollo/client';
import { GetWordsQueryVariables, Progress, WordPage } from './types/graphql';

const languageTypePolicy: TypePolicy = {
  fields: {
    words: {
      keyArgs: (args) => {
        const wordsArgs = args as GetWordsQueryVariables | null;
        if (wordsArgs?.lowConfidence) {
          return 'lowConfidence';
        } else if (wordsArgs?.query) {
          return 'search';
        } else {
          return false;
        }
      },
      merge(existing: WordPage | undefined, incoming: WordPage): WordPage {
        return {
          items: Array.from(
            new Set([...(existing?.items ?? []), ...incoming.items]),
          ),
          nextCursor: incoming.nextCursor,
          __typename: 'WordPage',
        };
      },
    },
    progress: {
      merge(original: Progress | undefined, incoming: Progress) {
        return {
          ...original,
          ...incoming,
        };
      },
    },
  },
};

export const cache = new InMemoryCache({
  typePolicies: {
    Language: languageTypePolicy,
  },
  possibleTypes: {
    IProperty: ['TextProperty', 'OptionProperty'],
    Property: ['TextProperty', 'OptionProperty'],
    IPropertyUpdate: ['TextPropertyUpdate', 'OptionPropertyUpdate'],
    PropertyUpdate: ['TextPropertyUpdate', 'OptionPropertyUpdate'],
    PropertyValue: ['TextPropertyValue', 'OptionPropertyValue'],
    IPropertyValueSave: ['TextPropertyValueSave', 'OptionPropertyValueSave'],
    PropertyValueSave: ['TextPropertyValueSave', 'OptionPropertyValueSave'],
    IChange: [
      'CreateLanguageChange',
      'UpdateLanguageChange',
      'DeleteLanguageChange',
      'CreatePropertyChange',
      'UpdatePropertyChange',
      'ReorderPropertiesChange',
      'DeletePropertyChange',
      'CreateWordChange',
      'UpdateWordChange',
      'DeleteWordChange',
    ],
    Change: [
      'CreateLanguageChange',
      'UpdateLanguageChange',
      'DeleteLanguageChange',
      'CreatePropertyChange',
      'UpdatePropertyChange',
      'ReorderPropertiesChange',
      'DeletePropertyChange',
      'CreateWordChange',
      'UpdateWordChange',
      'DeleteWordChange',
    ],
  },
  dataIdFromObject: (obj, context) => {
    if (
      context.typename === 'TextProperty' ||
      context.typename === 'OptionProperty'
    ) {
      return `Property:${obj.id}`;
    }
    return obj.id ? `${context.typename}:${obj.id}` : false;
  },
});

export const cacheClearWords = (languageId: string) => {
  cache.evict({
    id: `Language:${languageId}`,
    fieldName: 'words:search',
  });
  cache.evict({
    id: `Language:${languageId}`,
    fieldName: 'words:lowConfidence',
  });
};
