import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type LanguageContextType = [
  language: string | null,
  setLanguage: (language: string) => void,
];

export const LanguageContext = createContext<LanguageContextType>([
  null,
  () => {},
]);

const LOCAL_STORAGE_LANGUAGE_KEY = 'selectedLanguage';

type LanguageProviderProps = {
  children?: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY),
  );

  const setLanguageAndSave = useCallback((language: string) => {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
    setLanguage(language);
  }, []);

  const contextValue = useMemo<LanguageContextType>(
    () => [language, setLanguageAndSave],
    [language, setLanguageAndSave],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
