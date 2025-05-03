import { AccentColor } from '../../index.css';
import * as styles from './ProgressBar.css';

export type ProgressBarProps = {
  progress: number;
  color?: AccentColor;
};

export const ProgressBar = ({ progress, color }: ProgressBarProps) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.bar({ color })}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
