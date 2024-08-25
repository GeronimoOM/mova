import { useLazyQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo } from 'react';
import {
  GetWordsDocument,
  WordFieldsFragment,
} from '../../../api/types/graphql';
import {
  DATETIME_FORMAT,
  MIN_QUERY_LENGTH,
  WORDS_PAGE_SIZE,
} from '../../../utils/constants';
import { useLanguageContext } from '../../LanguageContext';

export type WordsListReturn = {
  words: Array<WordFieldsFragment | WordDateDivider> | undefined;
  wordsLoading: boolean;
  fetchNextWordsPage: () => void;
};

export function useWordsList(wordsSearchQuery: string): WordsListReturn {
  const [selectedLanguageId] = useLanguageContext();

  const [
    fetchWordsPage,
    { data: wordsQuery, loading: wordsLoading, fetchMore },
  ] = useLazyQuery(GetWordsDocument);
  const words = wordsQuery?.language?.words.items;
  const nextCursor = wordsQuery?.language?.words.nextCursor ?? null;
  const dividedWords = useMemo(
    () => (words ? divideByDate(words, Boolean(nextCursor)) : undefined),
    [words, nextCursor],
  );
  const isSearch = wordsSearchQuery.length >= MIN_QUERY_LENGTH;

  const fetchFirstWordsPage = useCallback(() => {
    if (!selectedLanguageId) {
      return;
    }

    fetchWordsPage({
      variables: {
        languageId: selectedLanguageId,
        limit: WORDS_PAGE_SIZE,
        ...(isSearch && {
          query: wordsSearchQuery,
        }),
      },
    });
  }, [selectedLanguageId, isSearch, wordsSearchQuery, fetchWordsPage]);

  const fetchNextWordsPage = useCallback(() => {
    if (!selectedLanguageId || !nextCursor) {
      return;
    }

    fetchMore({
      variables: {
        languageId: selectedLanguageId,
        limit: WORDS_PAGE_SIZE,
        cursor: nextCursor,
        ...(isSearch && {
          query: wordsSearchQuery,
        }),
      },
    });
  }, [selectedLanguageId, nextCursor, isSearch, wordsSearchQuery, fetchMore]);

  useEffect(() => {
    fetchFirstWordsPage();
  }, [fetchFirstWordsPage]);

  return useMemo(
    () => ({
      words: dividedWords,
      wordsLoading,
      fetchNextWordsPage,
    }),
    [dividedWords, wordsLoading, fetchNextWordsPage],
  );
}

export type WordDateDivider = {
  type: 'divider';
  date: DateTime;
  total: number;
  isTotalComplete: boolean;
};

export function divideByDate(
  words: WordFieldsFragment[],
  hasMore: boolean,
): Array<WordFieldsFragment | WordDateDivider> {
  const dividedWords: Array<WordFieldsFragment | WordDateDivider> = [];
  let currentDate: DateTime | null = null;
  let lastDivider: WordDateDivider | null = null;

  for (const word of words) {
    const wordDate = DateTime.fromFormat(word.addedAt, DATETIME_FORMAT);

    if (!currentDate || !wordDate.hasSame(currentDate, 'day')) {
      currentDate = wordDate;

      if (lastDivider) {
        lastDivider.isTotalComplete = true;
      }

      lastDivider = {
        type: 'divider',
        date: currentDate,
        total: 0,
        isTotalComplete: false,
      };

      dividedWords.push(lastDivider);
    }

    if (lastDivider) {
      lastDivider.total++;
    }

    dividedWords.push(word);
  }

  if (!hasMore && lastDivider) {
    lastDivider.isTotalComplete = true;
  }

  return dividedWords;
}

export function isDivider(
  wordOrDivider: WordFieldsFragment | WordDateDivider,
): wordOrDivider is WordDateDivider {
  return (wordOrDivider as WordDateDivider).type === 'divider';
}
