import { useLazyQuery, useMutation } from '@apollo/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GetUserSettingsDocument,
  UpdateSettingsDocument,
} from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

export type LanguageContextType = [
  language: string | null,
  setLanguage: (language: string | null) => void,
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
  const { authToken } = useAuthContext();

  const [language, setLanguage] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY),
  );

  const [fetchUserSettings] = useLazyQuery(GetUserSettingsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [updateUserSettings] = useMutation(UpdateSettingsDocument);

  const setLanguageAndSave = useCallback(
    (language: string | null, saveInApi = true) => {
      if (language) {
        localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);

        if (saveInApi) {
          updateUserSettings({
            variables: { input: { selectedLanguageId: language } },
          });
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_LANGUAGE_KEY);
      }

      setLanguage(language);
    },
    [updateUserSettings],
  );

  const contextValue = useMemo<LanguageContextType>(
    () => [language, setLanguageAndSave],
    [language, setLanguageAndSave],
  );

  useEffect(() => {
    if (authToken && !language) {
      fetchUserSettings().then(({ data: userSettings }) => {
        if (userSettings?.settings.selectedLanguageId) {
          setLanguageAndSave(userSettings.settings.selectedLanguageId, false);
        }
      });
    }
  }, [authToken, language, fetchUserSettings, setLanguageAndSave]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
