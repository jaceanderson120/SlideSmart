import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import Button from "../Button";

const Flashcard = ({ question, answer, cardIndex }) => {
  const [showAnswer, setShowAnswer] = useState(false);

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

  // Reset answer visibility when a new card is loaded
  useEffect(() => {
    setShowAnswer(false);
  }, [cardIndex]);

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  return (
    <>
      <QuestionHolder>{question}</QuestionHolder>
      {showAnswer && <AnswerHolder>{answer}</AnswerHolder>}
      <Button
        onClick={toggleAnswer}
        backgroundColor="transparent"
        hoverBackgroundColor="transparent"
        padding="12px"
        fontSize={({ theme }) => theme.fontSize.secondary}
        textColor={({ theme }) => theme.gray}
        hoverTextColor={({ theme }) => theme.primary}
        style={{ border: `1px solid ${({ theme }) => theme.white}` }}
      >
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </Button>
    </>
  );
};

const QuestionHolder = styled.div`
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  margin-bottom: 12px;
`;

const AnswerHolder = styled.div`
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  margin-bottom: 12px;
`;

export default Flashcard;
