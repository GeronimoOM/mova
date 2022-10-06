import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice,
    EntityState,
    PayloadAction,
} from '@reduxjs/toolkit';
import { Word } from '../types';
import * as api from '../graphql';
import { setSelectedLanguage } from './languages';

export interface WordsState extends EntityState<Word> {
    list: string[];
    hasMore: boolean;
    query: string | null;
    selected: string | null;
    fetching: boolean;
    creating: boolean;
}

export const wordsAdapter = createEntityAdapter<Word>();

const initialState: WordsState = wordsAdapter.getInitialState({
    list: [],
    hasMore: true,
    query: null,
    selected: null,
    fetching: false,
    creating: false,
});

export const fetchWords = createAsyncThunk('fetchWords', api.fetchWords);

export const createWord = createAsyncThunk('createWord', api.createWord);

export const updateWord = createAsyncThunk('updateWord', api.updateWord);

export const deleteWord = createAsyncThunk('deleteWord', api.deleteWord);

const wordsSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        setSelectedWord: (state, action: PayloadAction<string | null>) => {
            state.selected = action.payload;
        },

        setWordsQuery: (state, action: PayloadAction<string | null>) => {
            const query = action.payload;
            if (state.query !== query) {
                state.list = [];
                state.hasMore = true;
                state.query = action.payload;
                state.selected = null;
                state.fetching = false;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setSelectedLanguage, (state) => {
            state.entities = {};
            state.ids = [];
            state.list = [];
            state.hasMore = true;
            state.query = null;
            state.selected = null;
            state.fetching = false;
            state.creating = false;
        });

        builder.addCase(fetchWords.pending, (state) => {
            state.fetching = true;
        });
        builder.addCase(fetchWords.fulfilled, (state, { payload }) => {
            wordsAdapter.upsertMany(state, payload.items);
            state.list.push(...payload.items.map(word => word.id));
            state.hasMore = payload.hasMore;
            state.fetching = false;
        });
        builder.addCase(fetchWords.rejected, (state) => {
            state.hasMore = false;
            state.fetching = false;
        });

        builder.addCase(createWord.pending, (state) => {
            state.creating = true;
        });
        builder.addCase(createWord.fulfilled, (state, { payload }) => {
            wordsAdapter.addOne(state, payload);
            state.list.unshift(payload.id);
            state.creating = false;
            state.selected = payload.id;
        });
        builder.addCase(createWord.rejected, (state) => {
            state.creating = false;
        });

        builder.addCase(updateWord.fulfilled, (state, { payload }) => {
            wordsAdapter.upsertOne(state, payload);
        });

        builder.addCase(deleteWord.pending, (state, { meta }) => {
            wordsAdapter.removeOne(state, meta.arg);
            if (state.selected === meta.arg) {
                state.selected = null;
            }
        });
    },
});

export default wordsSlice.reducer;

export const { setSelectedWord, setWordsQuery } = wordsSlice.actions;

export const selectWords: (state: WordsState) => Word[] = 
    createSelector(
        [(state: WordsState) => state.list, (state: WordsState) => state.entities],
        (list, entities) => list.map((wordId) => entities[wordId]!),
    );

export const selectWordsQuery = (state: WordsState): string | null => state.query;

export const selectSelectedWord = (state: WordsState): Word | null =>
    state.selected ? state.entities[state.selected]! : null;

export const selectHasMoreWords = (state: WordsState): boolean => state.hasMore;

export const selectIsFetchingWords = (state: WordsState): boolean =>
    state.fetching;

export const selectIsCreatingWord = (state: WordsState): boolean =>
    state.creating;
