import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from '@reduxjs/toolkit';
import { Property } from '../types';
import * as api from '../graphql';
import { setSelectedLanguage } from './languages';

export interface PropertiesState extends EntityState<Property> {
    selected: string | null;
    loading: boolean;
    creating: boolean;
}

export const propertiesAdapter = createEntityAdapter<Property>();

const initialState: PropertiesState = propertiesAdapter.getInitialState({
    selected: null,
    loading: false,
    creating: false,
});

export const fetchProperties = createAsyncThunk(
    'fetchProperties',
    api.fetchProperties,
);

export const createProperty = createAsyncThunk(
    'createProperty',
    api.createProperty,
);

export const updateProperty = createAsyncThunk(
    'updateProperty',
    api.updateProperty,
);

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setSelectedProperty: (state, action: PayloadAction<string | null>) => {
            state.selected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setSelectedLanguage, (state) => {
            state.entities = {};
            state.ids = [];
            state.selected = null;
        });

        builder.addCase(fetchProperties.fulfilled, (state, { payload }) => {
            propertiesAdapter.upsertMany(state, payload);
        });

        builder.addCase(createProperty.pending, (state) => {
            state.creating = true;
        });
        builder.addCase(createProperty.fulfilled, (state, { payload }) => {
            propertiesAdapter.addOne(state, payload);
            state.creating = false;
        });
        builder.addCase(createProperty.rejected, (state) => {
            state.creating = false;
        });

        builder.addCase(updateProperty.fulfilled, (state, { payload }) => {
            propertiesAdapter.upsertOne(state, payload);
        });
    },
});

export default propertiesSlice.reducer;

export const { setSelectedProperty } = propertiesSlice.actions;

export const { selectAll: selectProperties } = propertiesAdapter.getSelectors();

export const selectSelectedProperty = (
    state: PropertiesState,
): Property | null => (state.selected ? state.entities[state.selected]! : null);

export const selectIsFetchingProperties = (
    state: PropertiesState,
): boolean => state.loading;

export const selectIsCreatingProperty = (
    state: PropertiesState,
): boolean => state.creating;