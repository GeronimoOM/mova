import classNames from 'classnames';
import React from 'react';
import { PartOfSpeech } from '../../api/types/graphql';
import * as styles from './PartOfSpeechPill.css';

export type PartOfSpeechPillProps = {
  partOfSpeech: PartOfSpeech;
  size?: 'medium' | 'large';
  disabled?: boolean;
  active?: boolean;
};

export const PartOfSpeechPill: React.FC<PartOfSpeechPillProps> = ({
  partOfSpeech,
  size,
  disabled,
  active,
}) => {
  return (
    <div className={classNames(styles.pill({ size, disabled }), { active })}>
      {partOfSpeech}
    </div>
  );
};
