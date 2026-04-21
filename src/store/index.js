import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';
import historyReducer from './slices/historySlice';
import favoritesReducer from './slices/favoritesSlice';
import friendReducer from './slices/friendSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    tasks: taskReducer,
    ui: uiReducer,
    history: historyReducer,
    favorites: favoritesReducer,
    friends: friendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
