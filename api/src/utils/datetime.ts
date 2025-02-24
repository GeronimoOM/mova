import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from './constants';

export function toTimestamp(dateTime: DateTime): string {
  return dateTime.toFormat(DATETIME_FORMAT);
}

export function fromTimestamp(timestamp: string): DateTime<true> {
  const dateTime = DateTime.fromFormat(timestamp, DATETIME_FORMAT, {
    zone: 'utc',
  });
  if (!dateTime.isValid) {
    throw new Error('Invalid timestamp');
  }

  return dateTime;
}
