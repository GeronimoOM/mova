import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguageContext } from '../LanguageContext';
import { WordDetails } from './WordDetails/WordDetails';
import { WordsList } from './WordsList/WordsList';
import * as styles from './WordsPage.css';
import { WordsSearchBar } from './WordsSearchBar/WordsSearchBar';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { isDivider, useWordsList } from './WordsList/useWordsList';
import { cacheClearWordsSearch } from '../../api/cache';

const SEARCH_DELAY_MS = 300;

export const WordsPage: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isWordDetailsOpen, setIsWordDetailsOpen] = useState(false);
  const [wordsSearchQuery, setWordsSearchQuery] = useState<string>('');

  const debouncedWordsSearchQuery = useDebouncedValue(
    wordsSearchQuery,
    SEARCH_DELAY_MS,
  );

  const { words, dividedWords, wordsLoading, fetchNextWordsPage } = useWordsList(
    debouncedWordsSearchQuery,
  );

  const handleWordSelect = useCallback((selectedWordId: string) => {
    setSelectedWordId(selectedWordId);
    setIsWordDetailsOpen(true);
    setWordsSearchQuery('');
  }, []);

  const handleCreateNew = useCallback(() => {
    setSelectedWordId(null);
    setIsWordDetailsOpen(true);
    setWordsSearchQuery('');
  }, []);

  useEffect(() => {
    if (selectedLanguageId) {
      setSelectedWordId(null);
    }
  }, [selectedLanguageId]);

  useEffect(() => {
    if (selectedLanguageId) {
      cacheClearWordsSearch(selectedLanguageId);
    }
  }, [selectedLanguageId, debouncedWordsSearchQuery]);

  const selectedWordIndex = useMemo(() => {
    const index = words?.findIndex((w) => !isDivider(w) && w.id === selectedWordId);

    return index !== -1 ? index : undefined;
  }, [words, selectedWordId]);

  const hasPrevWord = words && selectedWordIndex !== undefined && selectedWordIndex > 0;
  const handleSelectPrev = () => {
    if (!words || selectedWordIndex === undefined) {
      return;
    }

    setSelectedWordId(words[selectedWordIndex - 1].id);
  }

  const hasNextWord = words && selectedWordIndex !== undefined && selectedWordIndex < words?.length - 1;
  const handleSelectNext = () => {
    if (!words || selectedWordIndex === undefined) {
      return;
    }

    setSelectedWordId(words[selectedWordIndex + 1].id);
  }

  return (
    <div className={styles.wrapper}>
      {isWordDetailsOpen ? (
        <WordDetails
          wordId={selectedWordId}
          hasPrev={hasPrevWord}
          onSelectPrev={handleSelectPrev}
          hasNext={hasNextWord}
          onSelectNext={handleSelectNext}
          onSelectWord={setSelectedWordId}
          onClose={() => setIsWordDetailsOpen(false)}
        />
      ) : (
        <>
          <WordsSearchBar
            query={wordsSearchQuery}
            onQueryChange={setWordsSearchQuery}
            onClear={() => setWordsSearchQuery('')}
          />
          <WordsList
            words={dividedWords}
            wordsLoading={wordsLoading}
            wordsSearchQuery={wordsSearchQuery}
            onFetchNextPage={fetchNextWordsPage}
            onSelectWord={handleWordSelect}
            onCreateNew={handleCreateNew}
          />
        </>
      )}
    </div>
  );
};
