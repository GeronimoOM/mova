import React from 'react';
import { FaBrain } from 'react-icons/fa';
import { Icon } from '../common/Icon';
import { ProgressBar } from '../common/ProgressBar';
import * as styles from './ExerciseProgress.css';

export const ExerciseProgress: React.FC = () => {
  // TODO
  const progress = 3;
  const goal = 10;

  return (
    <div className={styles.wrapper}>
      <Icon icon={FaBrain} size="small" />
      <div className={styles.bar}>
        <ProgressBar progress={(progress / goal) * 100} type="secondary1" />
      </div>
      <span className={styles.label}>{`${progress} / ${goal}`}</span>
    </div>
  );
};
