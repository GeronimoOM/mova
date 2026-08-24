import { Static, Type } from '@sinclair/typebox';

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

export const AISentences = Type.Array(Type.String({ maxLength: 300 }));
export type AISentences = Static<typeof AISentences>;
