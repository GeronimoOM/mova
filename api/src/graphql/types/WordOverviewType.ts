import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('WordOverview')
export class WordOverviewType {
  @Field(() => [WordOverviewInterpretationType])
  interpretations: WordOverviewInterpretationType[];

  @Field({ nullable: true })
  extra?: string;
}

@ObjectType('WordOverviewInterpretation')
export class WordOverviewInterpretationType {
  @Field()
  interpretation: string;

  @Field()
  example: string;

  @Field()
  translation: string;
}
