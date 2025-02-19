import { useLazyQuery, useMutation } from '@apollo/client';
import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import {
  GetUserSettingsDocument,
  UpdateSettingsDocument,
} from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

export type Locale = 'en' | 'uk' | 'et';

export type LocaleContextType = [
  locale: Locale,
  setLocale: (locale: Locale) => void,
];

export const LocaleContext = createContext<LocaleContextType>(['en', () => {}]);

const LOCAL_STORAGE_LOCALE_KEY = 'selectedLocale';

type LocaleProviderProps = {
  children?: React.ReactNode;
};

export function initTranslator() {
  i18n
    .use(initReactI18next)
    .use(HttpBackend)
    .init<HttpBackendOptions>({
      backend: {
        loadPath: '/translations/{{lng}}.json',
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const { authToken } = useAuthContext();
  const { i18n } = useTranslation();

  const [locale, setLocale] = useState<Locale | null>(
    () => localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) as Locale,
  );

  const [fetchUserSettings] = useLazyQuery(GetUserSettingsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [updateUserSettings] = useMutation(UpdateSettingsDocument);

  const setLocaleAndSave = useCallback(
    (locale: Locale, saveInApi = true) => {
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, locale);
      if (saveInApi) {
        updateUserSettings({
          variables: {
            input: {
              selectedLocale: locale,
            },
          },
        });
      }

      setLocale(locale);
    },
    [updateUserSettings],
  );

  const contextValue = useMemo<LocaleContextType>(
    () => [locale ?? 'en', setLocaleAndSave],
    [locale, setLocaleAndSave],
  );

  useEffect(() => {
    if (authToken && !locale) {
      fetchUserSettings().then(({ data: userSettings }) => {
        if (userSettings?.settings.selectedLocale) {
          setLocaleAndSave(
            userSettings.settings.selectedLocale as Locale,
            false,
          );
        }
      });
    }
  }, [authToken, locale, fetchUserSettings, setLocaleAndSave]);

  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocaleContext = () => useContext(LocaleContext)!;
