import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('WordUsage')
export class WordUsageType {
  @Field(() => [WordUsageInterpretationType])
  interpretations: WordUsageInterpretationType[];

  @Field({ nullable: true })
  extra?: string;
}

@ObjectType('WordUsageInterpretation')
export class WordUsageInterpretationType {
  @Field()
  interpretation: string;

  @Field()
  example: string;

  @Field()
  translation: string;
}
