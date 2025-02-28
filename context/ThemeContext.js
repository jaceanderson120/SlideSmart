import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/constants/colors";
import { updateUserDarkMode, getUserDarkMode } from "@/firebase/database";
import { useStateContext } from "./StateContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser } = useStateContext();

  // Get the user's dark mode preference from the database
  useEffect(() => {
    if (currentUser) {
      getUserDarkMode(currentUser.uid).then((darkMode) => {
        setDarkMode(darkMode);
      });
    }
  }, [currentUser]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);

    // Update the user's dark mode preference in the database
    updateUserDarkMode(currentUser.uid, !darkMode);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
