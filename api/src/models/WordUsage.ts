import { Static, Type } from '@sinclair/typebox';

export const WordUsage = Type.Object({
  interpretations: Type.Array(
    Type.Object({
      interpretation: Type.String(),
      example: Type.String(),
      translation: Type.String(),
    }),
    {
      maxItems: 3,
    },
  ),
  extra: Type.Optional(Type.String()),
});
export type WordUsage = Static<typeof WordUsage>;
