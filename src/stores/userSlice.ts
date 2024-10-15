import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Get user from localStorage (if available)
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null;

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  } | null;
}

const initialState: UserState = {
  user: userFromStorage, // Initialize from localStorage if available
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload;
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      // Remove user from localStorage
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
