import { Static, Type } from '@sinclair/typebox';
import { Flavor } from 'utils/flavor';

export type AiOutputKey = Flavor<string, 'AiOutput'>;

export enum AiOutputType {
  WordOverview = 'word_overview',
}

export const AiWordOverview = Type.Object({
  interpretations: Type.Array(
    Type.Object({
      interpretation: Type.String({ maxLength: 200 }),
      example: Type.String({ maxLength: 300 }),
      translation: Type.String({ maxLength: 300 }),
    }),
    {
      minItems: 1,
      maxItems: 3,
    },
  ),
  extra: Type.Optional(Type.String({ maxLength: 500 })),
});
export type AiWordOverview = Static<typeof AiWordOverview>;

export const AIExampleSentences = Type.Array(Type.String({ maxLength: 300 }));
export type AIExampleSentences = Static<typeof AIExampleSentences>;
