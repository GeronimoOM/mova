import { TypePolicy } from '@apollo/client/cache';
import { InMemoryCache } from '@merged/solid-apollo';
import { LanguageWordsArgs, WordPage } from './types/graphql';

const languageTypePolicy: TypePolicy = {
  fields: {
    words: {
      keyArgs: (args: LanguageWordsArgs | null) => {
        return args?.query ||
          args?.partsOfSpeech?.length ||
          args?.topics?.length
          ? 'search'
          : false;
      },
      merge(existing: WordPage | undefined, incoming: WordPage): WordPage {
        // TODO smarter merging
        return {
          items: [...(existing?.items ?? []), ...incoming.items],
          nextCursor: incoming.nextCursor,
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
