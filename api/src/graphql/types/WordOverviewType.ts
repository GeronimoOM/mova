import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { WordId } from 'models/Word';

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
  wordForm: string;

  @Field()
  translation: string;
}

@InputType()
export class ResetWordOverviewInput {
  @Field(() => ID)
  id: WordId;
}
