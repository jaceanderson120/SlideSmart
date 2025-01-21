import React from "react";
import styled from "styled-components";

// Function to handle automatic font sizing
const calculateFontSize = (radius) => {
  // Formula to calculate font size based on circle radius
  return radius * 0.12;
};

const wrapText = (text, width, fontSize) => {
  // Ensure the text is a string (fallback to empty string if undefined or null)
  text = text || "";

  const maxLineLength = Math.floor(width / fontSize); // Approximate max characters per line
  const lines = [];
  let currentLine = "";
  const words = text.split(" "); // Split text into words

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Check if the word fits on the current line without overflowing
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      // If the word fits, add it to the current line
      currentLine += (currentLine ? " " : "") + word;
    } else {
      // If the word doesn't fit, check if it's a split word
      if (currentLine.length > 0) {
        // Add a hyphen only if we are splitting a word
        lines.push(currentLine);
      }
      currentLine = word; // Start a new line with the word
    }
  }

  if (currentLine) {
    lines.push(currentLine); // Push the last line if any remains
  }

  return lines;
};

const InfoCircle = ({ title, subtitle, align }) => {
  return (
    <CircleContainer>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="50" cy="50" r="50" fill="#fce2e4" />
        {renderText(title, subtitle, align)}
      </svg>
    </CircleContainer>
  );
};

// Function to render title and subtitle inside the circle
const renderText = (title, subtitle, align) => {
  const radius = 50; // Circle radius (50% of the viewBox width)
  const fontSizeTitle = calculateFontSize(radius);
  const fontSizeSubtitle = fontSizeTitle * 0.6;

  // Wrap the text to prevent overflow
  const wrappedTitle = wrapText(title, radius * 2.5, fontSizeTitle);
  const wrappedSubtitle = wrapText(subtitle, radius * 2.5, fontSizeSubtitle);

  // Render wrapped title and subtitle
  return (
    <>
      {wrappedTitle.map((line, index) => (
        <text
          key={`title-line-${index}`}
          x={align === "start" ? 35 : 65}
          y={35 + index * fontSizeTitle}
          textAnchor={align}
          dominantBaseline="middle"
          fontSize={fontSizeTitle}
          fontWeight={"bold"}
          fill="#000"
        >
          {line}
        </text>
      ))}
      {wrappedSubtitle.map((line, index) => (
        <text
          key={`subtitle-line-${index}`}
          x={align === "start" ? 35 : 65}
          y={55 + index * fontSizeSubtitle}
          textAnchor={align}
          dominantBaseline="middle"
          fontSize={fontSizeSubtitle}
          fill="#000"
        >
          {line}
        </text>
      ))}
    </>
  );
};

const CircleContainer = styled.div`
  width: min(85vh, 45vw);
  height: min(85vh, 45vw);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default InfoCircle;
