import { PartOfSpeech } from '../../api/types/graphql';

export type WordsSearchParams = {
  query: string;
  topic: string | null;
  partOfSpeech: PartOfSpeech | null;
};

export const defaultWordsSearchParams = (): WordsSearchParams => ({
  query: '',
  topic: null,
  partOfSpeech: null,
});
