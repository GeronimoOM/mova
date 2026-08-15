import { GraphQLScalarType } from 'graphql';
import { DateTime } from 'luxon';
import { fromTimestamp, toTimestamp } from 'utils/datetime';

export const TimestampScalar = new GraphQLScalarType<DateTime<true>, string>({
  name: 'Timestamp',
  description:
    'The `Timestamp` scalar type represents a timepoint as a string in the format `YYYY-MM-DD hh:mm:ss` .',
  serialize: (value: unknown) => {
    if (!DateTime.isDateTime(value)) {
      throw new Error('Not a valid DateTime value for serialization');
    }

    return toTimestamp(value);
  },
  parseValue: (value: unknown) => {
    if (typeof value !== 'string') {
      throw new Error('Not a valid DateTime value to parse');
    }

    return fromTimestamp(value);
  },
});
