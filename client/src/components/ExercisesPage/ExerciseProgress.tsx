import React from 'react';
import { ProgressType } from '../../api/types/graphql';
import {
  progressTypeToColor,
  progressTypeToIcon,
} from '../ProgressPage/progress';
import { Icon } from '../common/Icon';
import { ProgressBar } from '../common/ProgressBar';
import * as styles from './ExerciseProgress.css';

export const ExerciseProgress: React.FC = () => {
  // TODO
  const current = 3;
  const goal = 10;

  const progress = Math.min(current / goal, 1) * 100;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.icon({
          color: progressTypeToColor[ProgressType.Mastery],
        })}
      >
        <Icon icon={progressTypeToIcon[ProgressType.Mastery]} />
      </div>

      <div className={styles.bar}>
        <ProgressBar
          progress={progress}
          type={progressTypeToColor[ProgressType.Mastery]}
        />
      </div>
      <span className={styles.label}>{`${current} / ${goal}`}</span>
    </div>
  );
};
