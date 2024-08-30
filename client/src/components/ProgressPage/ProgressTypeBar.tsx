import React from 'react';
import {
  ProgressCadence,
  ProgressFieldsFragment,
  ProgressType,
} from '../../api/types/graphql';
import { Icon } from '../common/Icon';
import { ProgressBar } from '../common/ProgressBar';
import * as styles from './ProgressTypeBar.css';
import { progressTypeToColor, progressTypeToIcon } from './progress';

export type ProgressBarProps = {
  type: ProgressType;
  progress?: ProgressFieldsFragment;
};

export const ProgressTypeBar: React.FC<ProgressBarProps> = ({
  type,
  progress,
}) => {
  const currentPoints = progress?.current.points ?? 0;
  const goalPoints = progress?.goal?.points ?? 0;
  const progressPercent = goalPoints
    ? Math.min(1, currentPoints / goalPoints) * 100
    : 0;
  const cadence = progress?.cadence;
  const cadenceLabel = cadence
    ? cadence === ProgressCadence.Daily
      ? 'today'
      : 'this week'
    : '';

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.icon({
          color: progressTypeToColor[type],
        })}
      >
        <Icon icon={progressTypeToIcon[type]} />
      </div>

      <div className={styles.bar}>
        <ProgressBar
          progress={progressPercent}
          color={progressTypeToColor[type]}
        />
      </div>
      <div className={styles.label({ color: progressTypeToColor[type] })}>
        <span className={styles.labelNumber}>{currentPoints}</span>
        {'/'}
        <span className={styles.labelNumber}>{goalPoints}</span>
        <span className={styles.labelCadence}>{cadenceLabel}</span>
      </div>
    </div>
  );
};
