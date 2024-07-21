import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('WordsTotalStats')
export class WordsTotalStatsType {
  @Field((type) => Int)
  words: number;
}

@ObjectType('WordsDateStats')
export class WordsDateStats {
  @Field()
  date: string;

  @Field((type) => Int)
  words: number;
}

@ObjectType('WordsByDateStats')
export class WordsByDateStatsType {
  @Field()
  from: string;

  @Field()
  until: string;

  @Field((type) => [WordsDateStats])
  dates: WordsDateStats[];
}

@ObjectType('WordsStats')
export class WordsStatsType {
  @Field((type) => WordsTotalStatsType)
  total: WordsTotalStatsType;

  @Field((type) => WordsByDateStatsType)
  byDate: WordsByDateStatsType;
}
