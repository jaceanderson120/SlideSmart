import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/constants/colors";
import { updateUserDarkMode, getUserDarkMode } from "@/firebase/database";
import { useStateContext } from "./StateContext";

const ThemeContext = createContext();

const fontSize = {
  xlheading: "40px",
  heading: "30px",
  subheading: "24px",
  label: "18px",
  default: "16px",
  secondary: "14px", // used for info, details, captions
};

const fontSizeMobile = {
  xlheading: "32px",
  heading: "26px",
  subheading: "22px",
  label: "16px",
  default: "14px",
  secondary: "14px", // used for info, details, captions
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useStateContext();

  // Detect screen size to determine font size set
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get the user's dark mode preference from the database
  useEffect(() => {
    if (currentUser) {
      getUserDarkMode(currentUser.uid).then((darkMode) => {
        setDarkMode(darkMode ?? false);
      });
    } else {
      setDarkMode(false);
    }
  }, [currentUser]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    updateUserDarkMode(currentUser.uid, !darkMode);
  };

  const theme = {
    ...(darkMode ? darkTheme : lightTheme),
    fontSize: isMobile ? fontSizeMobile : fontSize,
  };

  return (
    darkMode !== undefined && (
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </ThemeContext.Provider>
    )
  );
};

export const useTheme = () => useContext(ThemeContext);
