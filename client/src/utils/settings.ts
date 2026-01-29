import { UserSettings } from '../api/types/graphql';
import {
  LOCAL_STORAGE_FONT_KEY,
  LOCAL_STORAGE_LANGUAGE_KEY,
  LOCAL_STORAGE_LOCALE_KEY,
} from './constants';

export function loadUserSettingsFromLocal(): UserSettings {
  return {
    selectedLocale: localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) ?? 'en',
    selectedFont: localStorage.getItem(LOCAL_STORAGE_FONT_KEY) ?? 'default',
    selectedLanguageId:
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) ?? null,
  };
}

export function saveUserSettingsToLocal(userSettings: UserSettings) {
  if (userSettings.selectedLocale) {
    localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, userSettings.selectedLocale);
  }
  if (userSettings.selectedFont) {
    localStorage.setItem(LOCAL_STORAGE_FONT_KEY, userSettings.selectedFont);
  }
  if (userSettings.selectedLanguageId) {
    localStorage.setItem(
      LOCAL_STORAGE_LANGUAGE_KEY,
      userSettings.selectedLanguageId,
    );
  }
}

export function clearUserSettingsFromLocal() {
  localStorage.removeItem(LOCAL_STORAGE_LANGUAGE_KEY);
}
