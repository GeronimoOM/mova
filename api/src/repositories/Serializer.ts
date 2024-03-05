import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from 'utils/constants';

const DATETIME_KEYS = ['addedAt', 'changedAt'];

@Injectable()
export class Serializer {
  serialize<T>(obj: T): string {
    return JSON.stringify(obj, (key, value) => {
      if (this.isDateTimeKey(key)) {
        return DateTime.fromISO(value).toFormat(DATETIME_FORMAT);
      }
      return value;
    });
  }

  deserialize<T>(json: string): T {
    return JSON.parse(json, (key, value) => {
      if (this.isDateTimeKey(key)) {
        return DateTime.fromFormat(value, DATETIME_FORMAT);
      }
      return value;
    });
  }

  private isDateTimeKey(key: string): boolean {
    return DATETIME_KEYS.includes(key);
  }
}
