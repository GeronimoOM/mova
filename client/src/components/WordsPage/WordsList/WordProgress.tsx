import React from 'react';
import { TbRectangle, TbRectangleFilled } from 'react-icons/tb';

import * as styles from './WordProgress.css';

const MAX_PROGRESS = 3;

// TODO implement in api
type WordProgressProps = {
  progress: number;
};

export const WordProgress: React.FC<WordProgressProps> = ({ progress }) => {
  return (
    <div className={styles.progress}>
      {Array(MAX_PROGRESS)
        .fill(null)
        .map((_, index) =>
          progress > index ? (
            <TbRectangleFilled key={index} />
          ) : (
            <TbRectangle key={index} />
          ),
        )}
    </div>
  );
};
