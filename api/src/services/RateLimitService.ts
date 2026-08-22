import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

export type RateLimitEntry = {
  key: string;
  bucket: RateLimitBucket;
  limit: number;
};

export enum RateLimitBucket {
  Hourly = 'hourly',
  Daily = 'daily',
}

type RateLimitUsage = {
  bucketStart: DateTime;
  count: number;
};

const DEFAULT_ACTOR = 'default';

@Injectable()
export class RateLimitService {
  private registry: Record<string, RateLimitEntry> = {};
  // instance key -> actor key -> actor usage
  private usage: Record<string, Record<string, RateLimitUsage>> = {};

  register(entry: RateLimitEntry) {
    this.registry[entry.key] = entry;
  }

  isRateLimited(key: string, actor = DEFAULT_ACTOR): boolean {
    const entry = this.registry[key];
    if (!entry) {
      Logger.warn('Unknown rate limit key', key);
      return false;
    }

    const { bucket, limit } = entry;

    const currentBucketStart = this.getCurrentBucketStart(bucket);
    const usage = this.getUsage(key, actor, currentBucketStart);

    if (!usage.bucketStart.equals(currentBucketStart)) {
      usage.bucketStart = currentBucketStart;
      usage.count = 0;
    }

    if (usage.count < limit) {
      usage.count++;

      return false;
    }

    return true;
  }

  private getUsage(
    key: string,
    actor: string,
    currentBucketStart: DateTime,
  ): RateLimitUsage {
    let keyUsage = this.usage[key];
    if (!keyUsage) {
      this.usage[key] = keyUsage = {};
    }

    let actorUsage = keyUsage[actor];
    if (!actorUsage) {
      keyUsage[actor] = actorUsage = {
        bucketStart: currentBucketStart,
        count: 0,
      };
    }

    return actorUsage;
  }

  private getCurrentBucketStart(bucket: RateLimitBucket): DateTime {
    switch (bucket) {
      case RateLimitBucket.Hourly:
        return DateTime.now().set({
          minute: 0,
          second: 0,
          millisecond: 0,
        });
      case RateLimitBucket.Daily:
        return DateTime.now().set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
    }
  }
}
