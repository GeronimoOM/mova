import React from 'react';
import { Color } from '../../index.css';
import * as styles from './ProgressBar.css';

export type ProgressBarProps = {
  progress: number;
  color?: Color;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
}) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.bar({ color })}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
