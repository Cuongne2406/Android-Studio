import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  isLoggedIn: false,
  userToken: null,
  profileData: {
    // ... same
  },
  profileAvatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.userToken = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userToken = null;
      state.profileData = initialState.profileData;
      AsyncStorage.removeItem('userToken');
    },
    updateProfile: (state, action) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },
    setAvatar: (state, action) => {
      state.profileAvatar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userToken = action.payload.token;
        state.profileData = {
          ...state.profileData,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
