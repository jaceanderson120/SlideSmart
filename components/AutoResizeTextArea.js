import { useEffect, useRef } from "react";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import { colors } from "@/constants/colors";

const AutoResizeTextArea = ({ defaultValue, onChange, editMode }) => {
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

  // If width of the container changes, adjust the height
  useEffect(() => {
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textAreaRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [textAreaRef.current]);

  return (
    <TextArea
      ref={textAreaRef}
      defaultValue={defaultValue}
      onChange={(e) => {
        onChange(e.target.value); // Pass the value to the parent component onChange function
      }}
      disabled={!editMode}
      $editMode={editMode} // Pass editMode to styled component
    />
  );
};

export default AutoResizeTextArea;

// Styled textarea with dynamic blinking border based on props
const TextArea = styled.textarea`
  border: none;
  width: 100%;
  color: ${colors.black};
  height: auto;
  font-size: ${fontSize.default};
  line-height: 1.3;
  border-radius: 8px;
  padding: 8px;
  resize: none;
  overflow: hidden;
  outline: none;
  background-color: ${(props) =>
    props.$editMode ? colors.white : "transparent"};
  box-shadow: ${(props) =>
    props.$editMode ? "0px 2px 2px rgba(0, 0, 0, 0.05)" : "none"};
`;
