import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PartOfSpeech } from 'models/Word';

@ObjectType('WordsStatsMastery')
export class WordsStatsMasteryType {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  mastery: number;
}

@ObjectType('WordsStatsConfidence')
export class WordsStatsConfidenceType {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  confidence: number;
}

@ObjectType('WordsStatsPartOfSpeech')
export class WordsStatsPartOfSpeechType {
  @Field(() => Int)
  total: number;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;
}

@ObjectType('WordsStats')
export class WordsStatsType {
  @Field(() => Int)
  total: number;

  @Field(() => [WordsStatsMasteryType])
  mastery: WordsStatsMasteryType[];

  @Field(() => [WordsStatsConfidenceType])
  confidence: WordsStatsConfidenceType[];

  @Field(() => [WordsStatsPartOfSpeechType])
  partsOfSpeech: WordsStatsPartOfSpeechType[];
}
