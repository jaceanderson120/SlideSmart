import React from "react";
import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import styled from "styled-components";

const ColorModeButton = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <LucideButton onClick={toggleDarkMode}>
      {darkMode ? <Sun /> : <MoonStar />}
    </LucideButton>
  );
};

const LucideButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.black}; /* Color inherited by the icons */
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export default ColorModeButton;
