import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from './constants';

export function toTimestamp(dateTime: DateTime | null): string | null {
  return dateTime?.toFormat(DATETIME_FORMAT) ?? null;
}

export function fromTimestamp(
  timestamp: string | null,
  isLocal = false,
): DateTime | null {
  return timestamp
    ? DateTime.fromFormat(timestamp, DATETIME_FORMAT, {
        zone: isLocal ? 'local' : 'utc',
      })
    : null;
}
