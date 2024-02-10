import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';

export const TimestampScalar = new GraphQLScalarType<DateTime, number>({
  name: 'Timestamp',
  description:
    'The `Timestamp` scalar type represents points as a number seconds since the UNIX epoch.',
  serialize: (value: DateTime) => value.toSeconds(),
  parseValue: (value: number) => DateTime.fromSeconds(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      return DateTime.fromMillis(Number(ast.value));
    }
    return null;
  },
});
