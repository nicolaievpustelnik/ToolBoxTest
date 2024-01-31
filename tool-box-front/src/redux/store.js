import { createStore } from 'redux';

// State
const initialState = {
    fileName: '',
    filteredData: [],
};

// Reducers
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_FILE_NAME':
            return { ...state, fileName: action.fileName };
        case 'SET_FILTERED_DATA':
            return { ...state, filteredData: Array.isArray(action.filteredData) ? action.filteredData : [] };
        default:
            return state;
    }
}

// Actions
export const SET_FILE_NAME = 'SET_FILE_NAME';
export const SET_FILTERED_DATA = 'SET_FILTERED_DATA';

// Selectors
export const getFileName = (state) => state.fileName;
export const getFilteredData = (state) => state.filteredData;

// Create and export the store
export const store = createStore(reducer);
export default store;