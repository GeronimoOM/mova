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

export const partOfSpeechToShortLabel: Record<PartOfSpeech, string> = {
  [PartOfSpeech.Noun]: 'pos.noun.short',
  [PartOfSpeech.Verb]: 'pos.verb.short',
  [PartOfSpeech.Adj]: 'pos.adj.short',
  [PartOfSpeech.Adv]: 'pos.adv.short',
  [PartOfSpeech.Pron]: 'pos.pron.short',
  [PartOfSpeech.Misc]: 'pos.misc.short',
};

export const partOfSpeechToFullLabel: Record<PartOfSpeech, string> = {
  [PartOfSpeech.Noun]: 'pos.noun.full',
  [PartOfSpeech.Verb]: 'pos.verb.full',
  [PartOfSpeech.Adj]: 'pos.adj.full',
  [PartOfSpeech.Adv]: 'pos.adv.full',
  [PartOfSpeech.Pron]: 'pos.pron.full',
  [PartOfSpeech.Misc]: 'pos.misc.full',
};
