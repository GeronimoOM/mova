import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';
import { fromTimestamp, toTimestamp } from 'utils/datetime';

export const TimestampScalar = new GraphQLScalarType<DateTime, string>({
  name: 'Timestamp',
  description:
    'The `Timestamp` scalar type represents a timepoint as a string in the format YYYY-MM-DD hh:mm:ss.',
  serialize: (value: DateTime) => toTimestamp(value),
  parseValue: (value: string) => fromTimestamp(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return fromTimestamp(ast.value);
    }
    return null;
  },
});
