import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Entry, EntryFull } from '../api/types';
import { select as selectLang } from './lang';

export interface EntriesState {
  byId: Record<string, Entry | EntryFull>;
  list: string[];
  selected: string | undefined;
}

export const entriesSlice = createSlice({
  name: 'entries',
  initialState: {
    byId: {},
    list: [],
    selected: undefined,
  } as EntriesState,
  reducers: {
    select: (state, action: PayloadAction<Entry | undefined>) => {
      state.selected = action.payload?.id;
    },
    appendPage: (state, action: PayloadAction<Entry[]>) => {
      for (const entry of action.payload) {
        state.byId[entry.id] = entry;
        state.list.push(entry.id);
      }
    },
    loadOne: (state, action: PayloadAction<EntryFull>) => {
      const entry = action.payload;
      (state.byId[entry.id] as EntryFull).customValues = entry.customValues;
    },
    createOne: (state, action: PayloadAction<EntryFull>) => {
      const entry = action.payload;
      state.byId[entry.id] = entry;
      state.list.unshift(entry.id);
    },
    updateOne: (state, action: PayloadAction<EntryFull>) => {
      const entry = action.payload;
      state.byId[entry.id] = entry;
    },
    deleteOne: (state, action: PayloadAction<string>) => {
      const entryId = action.payload;
      delete state.byId[entryId];
      state.list.splice(state.list.findIndex((id) => id === entryId)!, 1);
      if (entryId === state.selected) {
        state.selected = undefined;
      }
    },
  },
  extraReducers: {
    [selectLang.type]: (state) => {
      state.byId = {};
      state.list = [];
      state.selected = undefined;
    },
  },
});

export const {
  select,
  appendPage,
  loadOne,
  createOne,
  updateOne,
  deleteOne,
} = entriesSlice.actions;

export default entriesSlice.reducer;
