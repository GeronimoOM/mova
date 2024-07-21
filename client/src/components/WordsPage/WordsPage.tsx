import React, { useEffect, useState } from 'react';
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

  const handleWordSelect = (selectedWordId: string | null) => {
    setSelectedWordId(selectedWordId);
    setIsWordDetailsOpen(Boolean(selectedWordId));
  };

  const handleCreateNew = () => {
    setSelectedWordId(null);
    setIsWordDetailsOpen(true);
  };

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
        onCreateNew={handleCreateNew}
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
          onOpenDetails={() => setIsWordDetailsOpen(true)}
          wordsSearchQuery={wordsSearchQuery}
        />
      )}
    </div>
  );
};
