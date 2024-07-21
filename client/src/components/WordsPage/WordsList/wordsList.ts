import { DateTime } from 'luxon';
import { WordFieldsFragment } from '../../../api/types/graphql';
import { DATETIME_FORMAT } from '../../../utils/constants';

export type WordDateDivider = {
  type: 'divider';
  date: DateTime;
};

export function divideByDate(
  words: WordFieldsFragment[],
): Array<WordFieldsFragment | WordDateDivider> {
  const dividedWords: Array<WordFieldsFragment | WordDateDivider> = [];
  let currentDate: DateTime | null = null;

  for (const word of words) {
    const wordDate = DateTime.fromFormat(word.addedAt, DATETIME_FORMAT);

    if (!currentDate || !wordDate.hasSame(currentDate, 'day')) {
      currentDate = wordDate;
      dividedWords.push({ type: 'divider', date: currentDate });
    }

    dividedWords.push(word);
  }

  return dividedWords;
}

export function isDivider(
  wordOrDivider: WordFieldsFragment | WordDateDivider,
): wordOrDivider is WordDateDivider {
  return (wordOrDivider as WordDateDivider).type === 'divider';
}
