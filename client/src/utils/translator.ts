import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export type Locale = 'en' | 'uk' | 'et';

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

export function setLocale(locale: Locale) {
  i18n.changeLanguage(locale);
}
