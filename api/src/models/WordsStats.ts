import { PartOfSpeech, WordConfidence, WordMastery } from './Word';

export interface WordsStats {
  total: number;
  mastery: Record<WordMastery, number>;
  confidence: Record<WordConfidence, number>;
  partsOfSpeech: Record<PartOfSpeech, number>;
}
