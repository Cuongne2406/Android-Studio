import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  searchHistory: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action) => {
      state.searchHistory = action.payload;
    },
    addHistory: (state, action) => {
      const newHistory = [action.payload, ...state.searchHistory.filter(h => h.query !== action.payload.query)].slice(0, 20);
      state.searchHistory = newHistory;
      AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    },
    clearHistory: (state) => {
      state.searchHistory = [];
      AsyncStorage.setItem('searchHistory', JSON.stringify([]));
    },
  },
});

export const { setHistory, addHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
