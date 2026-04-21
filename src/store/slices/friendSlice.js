import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/friends');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch friends');
    }
  }
);

export const addFriend = createAsyncThunk(
  'friends/addFriend',
  async (friendData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/friends', friendData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add friend');
    }
  }
);

export const updateFriend = createAsyncThunk(
  'friends/updateFriend',
  async ({ id, friendData }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/friends/${id}`, friendData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update friend');
    }
  }
);

export const deleteFriend = createAsyncThunk(
  'friends/deleteFriend',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/friends/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete friend');
    }
  }
);

const initialState = {
  friends: [],
  loading: false,
  error: null,
};

const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    // For socket updates
    updateFriendLocally: (state, action) => {
      if (action.payload.deleted) {
        state.friends = state.friends.filter(f => f._id !== action.payload.id);
      } else {
        const index = state.friends.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.friends[index] = action.payload;
        } else {
          state.friends.unshift(action.payload);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addFriend.fulfilled, (state, action) => {
        state.friends.unshift(action.payload);
      })
      // Update
      .addCase(updateFriend.fulfilled, (state, action) => {
        const index = state.friends.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.friends[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(f => f._id !== action.payload);
      });
  },
});

export const { updateFriendLocally } = friendSlice.actions;
export default friendSlice.reducer;
