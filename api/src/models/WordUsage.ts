import { Static, Type } from '@sinclair/typebox';

export const WordUsage = Type.Object({
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
export type WordUsage = Static<typeof WordUsage>;
