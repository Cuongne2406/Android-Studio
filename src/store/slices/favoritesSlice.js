import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    toggleFavorite: (state, action) => {
      const student = action.payload;
      const index = state.items.findIndex(f => (f.id || f.mssv || f._id) === (student.id || student.mssv || student._id));
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(student);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
});

export const { setFavorites, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
