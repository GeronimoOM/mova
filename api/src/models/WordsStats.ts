import { PartOfSpeech, WordMastery } from './Word';

export interface WordsStats {
  total: number;
  mastery: Record<WordMastery, number>;
  partsOfSpeech: Record<PartOfSpeech, number>;
}
