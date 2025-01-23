import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Get user from localStorage (if available)
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null;

interface UserState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
    currentSite?: string; // Include currentSite if needed
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
    updateUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = { ...state.user, ...action.payload }; // Update user with new data
      localStorage.setItem('user', JSON.stringify(state.user)); // Update localStorage
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
