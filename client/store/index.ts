import {
    AnyAction,
    configureStore,
    createSelector,
    ThunkAction,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { createLogger } from 'redux-logger';

import languagesReducer, {
    selectLanguages,
    selectSelectedLanguage,
} from './languages';
import propertiesReducer, {
    selectProperties,
    selectSelectedProperty,
} from './properties';
import wordsReducer, { selectIsWordCreating, selectSelectedWord, selectWords } from './words';
import { PartOfSpeech, Word } from '../types';

export const store = configureStore({
    reducer: {
        languages: languagesReducer,
        properties: propertiesReducer,
        words: wordsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createLogger()),
});

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    State,
    unknown,
    AnyAction
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

export const useLanguages = () =>
    useAppSelector((state) => selectLanguages(state.languages));
export const useSelectedLanguage = () =>
    useAppSelector((state) => selectSelectedLanguage(state.languages));

export const useProperties = (partOfSpeech?: PartOfSpeech) =>
    useAppSelector((state) => {
        const properties = selectProperties(state.properties);
        return partOfSpeech
            ? properties.filter(
                  (property) => property.partOfSpeech === partOfSpeech,
              )
            : properties;
    });

export const useSelectedProperty = () =>
    useAppSelector((state) => selectSelectedProperty(state.properties));

export const useWords = () =>
    useAppSelector((state) => selectWords(state.words));
export const useSelectedWord = () =>
    useAppSelector((state) => selectSelectedWord(state.words));
export const useIsWordCreating = () =>
    useAppSelector((state) => selectIsWordCreating(state.words));
