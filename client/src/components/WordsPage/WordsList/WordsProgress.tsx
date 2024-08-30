import React from 'react';
import { FaBrain } from 'react-icons/fa';
import { Icon } from '../../common/Icon';
import { ProgressBar } from '../../common/ProgressBar';
import * as styles from './WordsProgress.css';

export const WordsProgress: React.FC = () => {
  // TODO use this
  const progress = 3;
  const goal = 10;

  return (
    <div className={styles.wrapper}>
      <Icon icon={FaBrain} size="small" />
      <div className={styles.bar}>
        <ProgressBar progress={(progress / goal) * 100} color="secondary2" />
      </div>
      <span className={styles.label}>{`${progress} / ${goal}`}</span>
    </div>
  );
};
