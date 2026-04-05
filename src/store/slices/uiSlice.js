import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  facultyFocus: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = action.payload !== undefined ? action.payload : !state.isDarkMode;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setFacultyFocus: (state, action) => {
      state.facultyFocus = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, setFacultyFocus } = uiSlice.actions;
export default uiSlice.reducer;
