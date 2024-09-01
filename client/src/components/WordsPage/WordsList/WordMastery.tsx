import React from 'react';
import { TbRectangle, TbRectangleFilled } from 'react-icons/tb';

import { Icon } from '../../common/Icon';
import * as styles from './WordMastery.css';

const MAX_PROGRESS = 3;

type WordMasteryProps = {
  mastery: number;
  size?: 'small' | 'medium';
};

export const WordMastery: React.FC<WordMasteryProps> = ({ mastery, size }) => {
  const iconSize = size === 'small' ? 'tiny' : size;

  return (
    <div className={styles.progress}>
      {Array(MAX_PROGRESS)
        .fill(null)
        .map((_, index) =>
          mastery > index ? (
            <Icon key={index} icon={TbRectangleFilled} size={iconSize} />
          ) : (
            <Icon key={index} icon={TbRectangle} size={iconSize} />
          ),
        )}
    </div>
  );
};
