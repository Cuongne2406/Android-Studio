import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchGarden = createAsyncThunk('garden/fetchGarden', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/garden');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Không thể tải vườn của bạn');
  }
});

export const addPlant = createAsyncThunk('garden/addPlant', async (plantData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/garden', plantData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Không thể thêm cây');
  }
});

export const updatePlant = createAsyncThunk('garden/updatePlant', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiClient.put(`/garden/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật cây');
  }
});

export const removePlant = createAsyncThunk('garden/removePlant', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`/garden/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Không thể xóa cây');
  }
});

const gardenSlice = createSlice({
  name: 'garden',
  initialState: {
    data: [],
    loading: false,
    refreshing: false,
    error: null,
  },
  reducers: {
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
    optimisticRemove: (state, action) => {
      state.data = state.data.filter(p => p._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.data = action.payload;
      })
      .addCase(fetchGarden.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })
      .addCase(addPlant.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updatePlant.fulfilled, (state, action) => {
        const index = state.data.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
            state.data[index] = action.payload;
        }
      })
      .addCase(removePlant.pending, (state, action) => {
        // We could do optimistic update here if we have the id in action.meta.arg
        // But we already have a dedicated reducer for it if we want to call it from component
      })
      .addCase(removePlant.fulfilled, (state, action) => {
        state.data = state.data.filter(p => p._id !== action.payload.id);
      })
      .addCase(removePlant.rejected, (state, action) => {
        state.error = action.payload;
        // In a real optimistic UI, we would roll back here
        // For simplicity, we'll just show the error
      });
  },
});

export const { setRefreshing, optimisticRemove } = gardenSlice.actions;
export default gardenSlice.reducer;
