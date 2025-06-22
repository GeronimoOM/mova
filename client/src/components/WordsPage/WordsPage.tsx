import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { cacheClearWordsSearch } from '../../api/cache';
import { AppRoute, wordRoute } from '../../routes';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { useLanguageContext } from '../LanguageContext';
import { WordDetails } from './WordDetails/WordDetails';
import { isDivider, useWordsList } from './WordsList/useWordsList';
import { WordsList } from './WordsList/WordsList';
import * as styles from './WordsPage.css';
import { WordsSearchBar } from './WordsSearchBar/WordsSearchBar';

const SEARCH_DELAY_MS = 300;

export const WordsPage = () => {
  const [selectedLanguageId] = useLanguageContext();
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isWordDetailsOpen, setIsWordDetailsOpen] = useState(false);
  const [wordsSearchQuery, setWordsSearchQuery] = useState<string>('');
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const debouncedWordsSearchQuery = useDebouncedValue(
    wordsSearchQuery,
    SEARCH_DELAY_MS,
  );

  const { words, dividedWords, wordsLoading, fetchNextWordsPage } =
    useWordsList(debouncedWordsSearchQuery);

  const handleWordSelect = useCallback(
    (selectedWordId: string | null) => {
      setSelectedWordId(selectedWordId);
      navigate(selectedWordId ? wordRoute(selectedWordId) : AppRoute.Default);
      setIsWordDetailsOpen(!!selectedWordId);
      setWordsSearchQuery('');
    },
    [navigate],
  );

  const handleCreateNew = useCallback(() => {
    setSelectedWordId(null);
    navigate(AppRoute.WordNew);
    setIsWordDetailsOpen(true);
    setWordsSearchQuery('');
  }, [navigate]);

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

  useEffect(() => {
    if (params.id) {
      setSelectedWordId(params.id);
      setIsWordDetailsOpen(true);
    } else {
      setSelectedWordId(null);
      setIsWordDetailsOpen(location.pathname === AppRoute.WordNew);
    }
  }, [params, location]);

  const selectedWordIndex = useMemo(() => {
    const index = words?.findIndex(
      (w) => !isDivider(w) && w.id === selectedWordId,
    );

    return index !== -1 ? index : undefined;
  }, [words, selectedWordId]);

  const hasPrevWord =
    words &&
    selectedWordIndex !== undefined &&
    selectedWordIndex !== -1 &&
    selectedWordIndex > 0;
  const handleSelectPrev = () => {
    if (!words || selectedWordIndex === undefined) {
      return;
    }

    handleWordSelect(words[selectedWordIndex - 1].id);
  };

  const hasNextWord =
    words &&
    selectedWordIndex !== undefined &&
    selectedWordIndex !== -1 &&
    selectedWordIndex < words?.length - 1;
  const handleSelectNext = () => {
    if (!words || selectedWordIndex === undefined) {
      return;
    }

    handleWordSelect(words[selectedWordIndex + 1].id);
  };

  return (
    <div className={styles.wrapper}>
      {isWordDetailsOpen ? (
        <WordDetails
          wordId={selectedWordId}
          hasPrev={hasPrevWord}
          onSelectPrev={handleSelectPrev}
          hasNext={hasNextWord}
          onSelectNext={handleSelectNext}
          onSelectWord={handleWordSelect}
          onClose={() => handleWordSelect(null)}
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
