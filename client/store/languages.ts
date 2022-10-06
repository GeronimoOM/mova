import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'
import { Language } from '../types';
import * as api from '../graphql';

const COOKIE_SELECTED_LANGUAGE = 'selected_language';

export interface LanguagesState extends EntityState<Language> {
    selected: string | null;
}

export const languagesAdapter = createEntityAdapter<Language>();

const initialState: LanguagesState = languagesAdapter.getInitialState({
    selected: Cookies.get(COOKIE_SELECTED_LANGUAGE) ?? null,
});

export const fetchLanguages = createAsyncThunk(
    'fetchLanguages',
    api.fetchLanguages,
);

export const createLanguage = createAsyncThunk(
    'createLanguage',
    api.createLanguage,
);

export const updateLanguage = createAsyncThunk(
    'updateLanguage',
    api.updateLanguage,
);

const languagesSlice = createSlice({
    name: 'languages',
    initialState,
    reducers: {
        setSelectedLanguage: (state, action: PayloadAction<string>) => {
            const selectedLanguage = action.payload;
            state.selected = selectedLanguage;
            Cookies.set(COOKIE_SELECTED_LANGUAGE, selectedLanguage);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            fetchLanguages.fulfilled,
            (state, { payload }) => {
                languagesAdapter.addMany(state, payload);
            },
        );

        builder.addCase(
            createLanguage.fulfilled,
            (state, { payload }) => {
                languagesAdapter.addOne(state, payload);
            },
        );

        builder.addCase(
            updateLanguage.fulfilled,
            (state, { payload }) => {
                languagesAdapter.upsertOne(state, payload);
            },
        );
    }
});

export default languagesSlice.reducer;

export const { setSelectedLanguage } = languagesSlice.actions;

export const {
    selectAll: selectLanguages,
} = languagesAdapter.getSelectors();

export const selectSelectedLanguage = (state: LanguagesState): Language | null => 
    state.selected
        ? state.entities[state.selected]!
        : null;