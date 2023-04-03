import React, { useMemo } from "react";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";
import { RouterProvider, useLocation } from "react-router-dom";
import About from "./pages/About";
import router from "./router";
import { lightTheme, darkTheme } from "./theme";
import { Toast } from "./components/Snackbar/Snackbar";
import { useAppSelector } from "./store/hooks";
import { createTheme } from "@mui/material/styles";

function App() {
  const { themeMode } = useAppSelector((state) => ({
    themeMode: state.setting.themeMode,
  }));

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const followSystemTheme = useMemo(
    () =>
      createTheme({
        typography: {
          htmlFontSize: 10,
        },
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider
      theme={
        themeMode === "followSystem"
          ? followSystemTheme
          : themeMode === "light"
          ? lightTheme
          : darkTheme
      }
    >
      <CssBaseline />
      <RouterProvider router={router} />
      <Toast />
    </ThemeProvider>
  );
}

export default App;
