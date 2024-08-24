import { DateTime } from 'luxon';
import React from 'react';
import { WordFieldsFragment } from '../../../api/types/graphql';
import { PartOfSpeechPill } from '../../common/PartOfSpeechPill';
import { WordMastery } from './WordMastery';
import * as styles from './WordsListItem.css';

export type WordsListItemProps = {
  word: WordFieldsFragment;
  setSelectedWord: (selectedWord: string) => void;
};

export const WordsListItem: React.FC<WordsListItemProps> = ({
  word,
  setSelectedWord,
}) => {
  return (
    <div className={styles.item} onClick={() => setSelectedWord(word.id)}>
      <div className={styles.original}>{word.original}</div>
      <div className={styles.translation}>{word.translation}</div>
      <div>
        <WordMastery mastery={word.mastery} size="small" />
      </div>
      <PartOfSpeechPill partOfSpeech={word.partOfSpeech} disabled />
    </div>
  );
};

export type WordsListItemDividerProps = {
  date: DateTime;
};

export const WordsListItemDivider: React.FC<WordsListItemDividerProps> = ({
  date,
}) => {
  return (
    <div className={styles.divider}>
      {date.toLocaleString({ month: 'long', day: 'numeric' })}
    </div>
  );
};
