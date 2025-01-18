import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import menuReducer from "./menuSlice";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import { alertSlice } from "./alertSlice";
import loadingReducer from "./loadingSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    menu: menuReducer,
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    alerts: alertSlice.reducer,
    loading: loadingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  menu: ReturnType<typeof menuReducer>;
  // ... other slices
}
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
