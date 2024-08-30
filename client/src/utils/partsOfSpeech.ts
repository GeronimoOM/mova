import { PartOfSpeech } from '../api/types/graphql';

export const partsOfSpeech: PartOfSpeech[] = [
  PartOfSpeech.Noun,
  PartOfSpeech.Verb,
  PartOfSpeech.Adj,
  PartOfSpeech.Adv,
  PartOfSpeech.Pron,
  PartOfSpeech.Misc,
];

export const partOfSpeechToColor: Record<PartOfSpeech, string> = {
  [PartOfSpeech.Noun]: '#00a1e4',
  [PartOfSpeech.Verb]: '#04e762',
  [PartOfSpeech.Adj]: '#89fc00',
  [PartOfSpeech.Adv]: '#f5b700',
  [PartOfSpeech.Pron]: '#ee522b',
  [PartOfSpeech.Misc]: '#bb4dff',
};
