import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PartOfSpeech } from 'models/Word';

@ObjectType('WordsStatsMastery')
export class WordsStatsMasteryType {
  @Field((type) => Int)
  total: number;

  @Field((type) => Int)
  mastery: number;
}

@ObjectType('WordsStatsPartOfSpeech')
export class WordsStatsPartOfSpeechType {
  @Field((type) => Int)
  total: number;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;
}

@ObjectType('WordsStats')
export class WordsStatsType {
  @Field((type) => Int)
  total: number;

  @Field((type) => [WordsStatsMasteryType])
  mastery: WordsStatsMasteryType[];

  @Field((type) => [WordsStatsPartOfSpeechType])
  partsOfSpeech: WordsStatsPartOfSpeechType[];
}
