import React from 'react';
import { PartOfSpeech } from '../../api/types/graphql';
import * as styles from './PartOfSpeechPill.css';

export type PartOfSpeechPillProps = {
  partOfSpeech: PartOfSpeech;
  size?: 'medium' | 'large';
};

export const PartOfSpeechPill: React.FC<PartOfSpeechPillProps> = ({
  partOfSpeech,
  size,
}) => {
  return <span className={styles.pill({ size })}>{partOfSpeech}</span>;
};
