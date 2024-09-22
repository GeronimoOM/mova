import React from 'react';
import { TbRectangle, TbRectangleFilled } from 'react-icons/tb';

import { Icon } from '../../common/Icon';
import * as styles from './WordMastery.css';

const MAX_PROGRESS = 3;

type WordMasteryProps = {
  mastery: number;
};

export const WordMastery: React.FC<WordMasteryProps> = ({ mastery }) => {
  return (
    <div className={styles.progress}>
      {Array(MAX_PROGRESS)
        .fill(null)
        .map((_, index) =>
          mastery > index ? (
            <Icon key={index} icon={TbRectangleFilled} />
          ) : (
            <Icon key={index} icon={TbRectangle} />
          ),
        )}
    </div>
  );
};
