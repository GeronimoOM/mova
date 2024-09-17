import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { useCallback } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

export type TranslatorLanguage = 'en' | 'uk' | 'et';

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

export function useTranslationLanguage() {
  const { i18n } = useTranslation();

  return i18n.language as TranslatorLanguage;
}

export function useChangeTranslationLanguage() {
  const { i18n } = useTranslation();

  return useCallback(
    (language: TranslatorLanguage) => {
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
    },
    [i18n],
  );
}
