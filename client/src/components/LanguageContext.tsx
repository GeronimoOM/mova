import { useQuery } from '@apollo/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { GetLanguagesDocument } from '../api/types/graphql';
import { useUserContext } from './UserContext';

export type LanguageContextType = [
  language: string | null,
  setLanguage: (language: string) => void,
];

export const LanguageContext = createContext<LanguageContextType>([
  null,
  () => {},
]);

type LanguageProviderProps = {
  children?: React.ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { authToken, settings, setSettings } = useUserContext();
  const language = settings.selectedLanguageId ?? null;

  const setLanguage = useCallback(
    (languageId: string) => {
      setSettings({
        selectedLanguageId: languageId,
      });
    },
    [setSettings],
  );

  const { data: languagesQuery } = useQuery(GetLanguagesDocument);
  const languages = languagesQuery?.languages;

  const contextValue = useMemo<LanguageContextType>(
    () => [language, setLanguage],
    [language, setLanguage],
  );

  useEffect(() => {
    if (authToken && !language && languages?.length) {
      setLanguage(languages[0].id);
    }
  }, [authToken, language, languages, setLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
