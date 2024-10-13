import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { fromTimestamp, toTimestamp } from 'utils/datetime';

const DATETIME_KEYS = [
  'addedAt',
  'changedAt',
  'masteryIncAt',
  'masteryAttemptAt',
];

@Injectable()
export class Serializer {
  serialize<T>(obj: T): string {
    return JSON.stringify(obj, (key, value) => {
      if (this.isDateTimeKey(key)) {
        return toTimestamp(DateTime.fromISO(value));
      }
      return value;
    });
  }

  deserialize<T>(json: string): T {
    return JSON.parse(json, (key, value) => {
      if (this.isDateTimeKey(key)) {
        return fromTimestamp(value);
      }
      return value;
    });
  }

  copy<T>(obj: T): T {
    return this.deserialize(this.serialize(obj));
  }

  private isDateTimeKey(key: string): boolean {
    return DATETIME_KEYS.includes(key);
  }
}
