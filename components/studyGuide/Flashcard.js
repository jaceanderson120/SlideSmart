import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import Button from "../Button";

const Flashcard = ({ front, back, cardIndex }) => {
  const [showFront, setShowFront] = useState(true);
  const [showBack, setShowBack] = useState(false);

  const theme = useTheme();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.lightGray,
      border: "none",
      boxShadow: `4px 4px 4px ${theme.shadow}`,
      width: "90%",
      maxWidth: "400px",
      height: "auto",
      padding: "24px",
      borderRadius: "16px",
    },
  };

  // Reset front visibility when a new card is loaded
  useEffect(() => {
    setShowFront(true);
    setShowBack(false);
  }, [cardIndex]);

  const toggleSide = () => {
    setShowFront((prev) => !prev);
    setShowBack((prev) => !prev);
  };

  return (
    <>
      {showFront && <FrontHolder>{front}</FrontHolder>}
      {showBack && <BackHolder>{back}</BackHolder>}
      <Button
        onClick={toggleSide}
        backgroundColor="transparent"
        hoverBackgroundColor="transparent"
        padding="12px"
        fontSize={({ theme }) => theme.fontSize.secondary}
        textColor={({ theme }) => theme.gray}
        hoverTextColor={({ theme }) => theme.primary}
        style={{ border: `1px solid ${({ theme }) => theme.white}` }}
      >
        Flip
      </Button>
    </>
  );
};

const FrontHolder = styled.div`
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  margin-bottom: 12px;
`;

const BackHolder = styled.div`
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  margin-bottom: 12px;
`;

export default Flashcard;
