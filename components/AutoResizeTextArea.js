import { useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

const AutoResizeTextArea = ({ defaultValue, editMode }) => {
  const textAreaRef = useRef(null);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to the scroll height
    }
  };

  // Adjust height on mount and when value changes
  useEffect(() => {
    adjustHeight();
  }, [defaultValue]);

  return (
    <TextArea
      ref={textAreaRef}
      defaultValue={defaultValue}
      onChange={() => {
        adjustHeight(); // Adjust height immediately on user input
      }}
      disabled={!editMode}
      $editMode={editMode} // Pass editMode to styled component
    />
  );
};

export default AutoResizeTextArea;

// Define a blinking border animation
const blinkingBorder = keyframes`
  0% {
    border-color: #7fa3ff;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: #7fa3ff;
  }
`;

// Styled textarea with dynamic blinking border based on props
const TextArea = styled.textarea`
  width: 100%;
  color: #000000;
  height: auto;
  font-size: 1.5rem;
  border: 2px dashed transparent;
  border-radius: 8px;
  padding: 8px;
  resize: none;
  overflow: hidden;
  outline: none;
  background-color: transparent;

  ${({ $editMode }) =>
    $editMode &&
    css`
      animation: ${blinkingBorder} 2s infinite;
    `}
`;
