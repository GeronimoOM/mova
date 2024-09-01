import classNames from 'classnames';
import React from 'react';
import { PartOfSpeech } from '../../api/types/graphql';
import * as styles from './PartOfSpeechPill.css';

export type PartOfSpeechPillProps = {
  partOfSpeech: PartOfSpeech;
  disabled?: boolean;
  active?: boolean;
};

export const PartOfSpeechPill: React.FC<PartOfSpeechPillProps> = ({
  partOfSpeech,
  disabled,
  active,
}) => {
  return (
    <div className={classNames(styles.pill({ disabled }), { active })}>
      {partOfSpeech}
    </div>
  );
};
