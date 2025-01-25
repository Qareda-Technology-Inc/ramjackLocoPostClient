import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import menuReducer from "./menuSlice";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import { alertSlice } from "./alertSlice";
import loadingReducer from "./loadingSlice";
import userReducer from "./userSlice";
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  colorScheme: colorSchemeReducer,
  menu: menuReducer,
  theme: themeReducer,
  auth: authReducer,
  user: userReducer,
  alerts: alertSlice.reducer,
  loading: loadingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
