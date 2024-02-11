import { TypePolicy } from '@apollo/client';
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
  dataIdFromObject: (obj, context) => {
    if (
      context.typename === 'TextProperty' ||
      context.typename === 'OptionProperty'
    ) {
      return `Property:${obj.id}`;
    }
    return `${context.typename}:${obj.id}`;
  },
  typePolicies: {
    Language: languageTypePolicy,
  },
});
