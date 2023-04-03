import { configureStore } from "@reduxjs/toolkit";
import ToastReducer from "./ToastSlice";
import SettingSlice from "./SettingSlice";

const store = configureStore({
  reducer: {
    toast: ToastReducer,
    setting: SettingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
