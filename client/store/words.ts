import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from '@reduxjs/toolkit';
import { Word } from '../types';
import * as api from '../graphql';
import { setSelectedLanguage } from './languages';

export interface WordsState extends EntityState<Word> {
    query: string | null;
    list: string[];
    hasMore: boolean;
    selected: string | null;
    creating: boolean;
}

export const wordsAdapter = createEntityAdapter<Word>();

const initialState: WordsState = wordsAdapter.getInitialState({
    query: null,
    list: [],
    hasMore: true,
    selected: null,
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

        setQuery: (state, action: PayloadAction<string | null>) => {
            state.query = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setSelectedLanguage, (state) => {
            state.entities = {};
            state.ids = [];
            state.selected = null;
        });

        builder.addCase(fetchWords.fulfilled, (state, { payload }) => {
            wordsAdapter.upsertMany(state, payload.items);
        });

        builder.addCase(createWord.pending, (state) => {
            state.creating = true;
        });
        builder.addCase(createWord.fulfilled, (state, { payload }) => {
            wordsAdapter.addOne(state, payload);
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

export const { setSelectedWord } = wordsSlice.actions;

export const { selectAll: selectWords } = wordsAdapter.getSelectors();

export const selectSelectedWord = (state: WordsState): Word | null =>
    state.selected ? state.entities[state.selected]! : null;

export const selectIsWordCreating = (state: WordsState): boolean =>
    state.creating;
