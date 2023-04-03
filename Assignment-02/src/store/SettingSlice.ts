import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertColor } from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch } from "./store";
import { delay } from "../utils/common-utils";

export type ThemeMode = "followSystem" | "light" | "dark";

const initialState: {
  themeMode: ThemeMode;
} = {
  themeMode: "followSystem",
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      const newThemeMode = action.payload;
      state.themeMode = newThemeMode;
    },
  },
});

export const { setThemeMode } = settingSlice.actions;

export default settingSlice.reducer;
