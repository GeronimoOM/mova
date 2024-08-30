import React, { useCallback, useEffect, useState } from 'react';
import { useLanguageContext } from '../LanguageContext';
import { WordDetails } from './WordDetails/WordDetails';
import { WordsList } from './WordsList/WordsList';
import * as styles from './WordsPage.css';
import { WordsSearchBar } from './WordsSearchBar/WordsSearchBar';

export const WordsPage: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isWordDetailsOpen, setIsWordDetailsOpen] = useState(false);
  const [wordsSearchQuery, setWordsSearchQuery] = useState<string>('');

  const handleWordSelect = useCallback((selectedWordId: string) => {
    setSelectedWordId(selectedWordId);
    setIsWordDetailsOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setSelectedWordId(null);
    setIsWordDetailsOpen(true);
  }, []);

  useEffect(() => {
    if (selectedLanguageId) {
      setSelectedWordId(null);
    }
  }, [selectedLanguageId]);

  return (
    <div className={styles.wrapper}>
      <WordsSearchBar
        query={wordsSearchQuery}
        onQueryChange={setWordsSearchQuery}
        onClear={() => setWordsSearchQuery('')}
      />
      {isWordDetailsOpen ? (
        <WordDetails
          wordId={selectedWordId}
          onSelectWord={setSelectedWordId}
          onClose={() => setIsWordDetailsOpen(false)}
        />
      ) : (
        <WordsList
          onSelectWord={handleWordSelect}
          onCreateNew={handleCreateNew}
          onOpenDetails={() => setIsWordDetailsOpen(true)}
          wordsSearchQuery={wordsSearchQuery}
        />
      )}
    </div>
  );
};
