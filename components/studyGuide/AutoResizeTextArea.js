import { useEffect, useRef } from "react";
import styled from "styled-components";
import CodeBlock from "./CodeBlock";

const AutoResizeTextArea = ({ value, onChange, editMode, label }) => {
  const textAreaRef = useRef(null);

  // Adjust height dynamically based on content
  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  // Adjust height on mount and whenever value changes
  useEffect(() => {
    adjustHeight();
  }, [value]);

  // Listen for container resizing
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(adjustHeight, 0); // Debounce
    });

    if (textAreaRef.current) resizeObserver.observe(textAreaRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Split content into text and code blocks
  const splitText = (text) => {
    const parts = [];
    const codeRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({ type: "code", content: match[1] });
      lastIndex = codeRegex.lastIndex;
    }

    if (lastIndex < text.length)
      parts.push({ type: "text", content: text.slice(lastIndex) });
    return parts;
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      {editMode ? (
        <StyledTextArea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <ContentDisplay ref={textAreaRef}>
          {splitText(value).map((part, index) =>
            part.type === "code" ? (
              <CodeBlock key={index} code={part.content} />
            ) : (
              <span key={index}>{part.content}</span>
            )
          )}
        </ContentDisplay>
      )}
    </Container>
  );
};

export default AutoResizeTextArea;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

const StyledTextArea = styled.textarea`
  border: none;
  width: 100%;
  color: ${({ theme }) => theme.black};
  font-size: ${({ theme }) => theme.fontSize.default};
  line-height: 1.3;
  border-radius: 8px;
  padding: 8px;
  resize: none;
  overflow: hidden;
  outline: none;
  background-color: ${({ theme }) => theme.lightGray};
  box-shadow: 0px 2px 2px ${({ theme }) => theme.shadow};
  white-space: pre-wrap;
`;

const ContentDisplay = styled.div`
  border: none;
  width: 100%;
  color: ${({ theme }) => theme.black};
  font-size: ${({ theme }) => theme.fontSize.default};
  line-height: 1.3;
  border-radius: 8px;
  padding: 8px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background-color: transparent;
`;
