import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import plantReducer from './slices/plantSlice';
import gardenReducer from './slices/gardenSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    plants: plantReducer,
    garden: gardenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
