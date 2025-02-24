// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axios';
import { User } from '@/types/auth';

export const login = createAsyncThunk(
  'auth/login',
  async ({ identityNo, password }: { identityNo: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('users/login', { identityNo, password });
      return response.data; // Assumes response contains { user, token }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: JSON.parse(localStorage.getItem('user') || 'null'), // Persist user across refreshes
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { startLoading, stopLoading, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
