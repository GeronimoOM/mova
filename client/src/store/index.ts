import { configureStore } from '@reduxjs/toolkit';
import langReducer, { LangState } from './lang';
import entriesReducer from './entries';
import { useSelector } from 'react-redux';
import { Entry, EntryFull, Language } from '../api/types';

const store = configureStore({
  reducer: {
    lang: langReducer,
    entries: entriesReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

export const useLangSelector = () =>
  useSelector<AppState, Language | undefined>((state) => state.lang.value);

export const useEntriesSelector = () =>
  useSelector<AppState, Entry[]>((state) =>
    state.entries.list.map((entryId) => state.entries.byId[entryId]),
  );

export const useEntrySelector = () =>
  useSelector<AppState, Entry | EntryFull | undefined>((state) =>
    state.entries.selected
      ? state.entries.byId[state.entries.selected]
      : undefined,
  );
