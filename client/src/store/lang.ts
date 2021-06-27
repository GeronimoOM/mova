import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'cookies-js';
import { Language } from '../api/types';

const COOKIE_SELECTED_LANG = 'selectedLang';

function getLangCookie(): Language | undefined {
  const cookie = Cookies.get(COOKIE_SELECTED_LANG);
  return cookie && JSON.parse(cookie);
}

function setLangCookie(selectedLang: Language) {
  Cookies.set(COOKIE_SELECTED_LANG, JSON.stringify(selectedLang));
}

export interface LangState {
  value: Language | undefined;
}

export const langSlice = createSlice({
  name: 'lang',
  initialState: {
    value: getLangCookie(),
  } as LangState,
  reducers: {
    select: (state, action: PayloadAction<Language>) => {
      const lang = action.payload;
      state.value = lang;
      setLangCookie(lang);
    },
  },
});

export const { select } = langSlice.actions;

export default langSlice.reducer;
