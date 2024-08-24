import React from 'react';
import { Color } from '../../index.css';
import * as styles from './ProgressBar.css';

export type ProgressBarProps = {
  progress: number;
  type?: Color;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, type }) => {
  return (
    <div className={styles.container}>
      <div className={styles.bar({ type })} style={{ width: `${progress}%` }} />
    </div>
  );
};
