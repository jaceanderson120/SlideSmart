import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import Button from "../Button";

const Flashcard = ({ front, back, cardIndex }) => {
  const [showFront, setShowFront] = useState(true);

  // Reset front visibility when a new card is loaded
  useEffect(() => {
    setShowFront(true);
  }, [cardIndex]);

  const toggleSide = () => {
    setShowFront((prev) => !prev);
  };

  return (
    <FlashcardContainer onClick={toggleSide}>
      <FlashcardText>{showFront ? front : back}</FlashcardText>
    </FlashcardContainer>
  );
};

const FlashcardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
  background-color: ${({ theme }) => theme.white};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px ${({ theme }) => theme.shadow};
`;

const FlashcardText = styled.div`
  color: ${({ theme }) => theme.black};
  font-size: ${({ theme }) => theme.fontSize.subheading};
  margin-bottom: 12px;
  cursor: pointer;
`;

export default Flashcard;
