import { PartOfSpeech } from '../../../api/types/graphql';

export type WordsSearchParams = {
  query: string;
  topics: string[];
  partsOfSpeech: PartOfSpeech[];
};

export const defaultWordsSearchParams = (): WordsSearchParams => ({
  query: '',
  topics: [],
  partsOfSpeech: [],
});
