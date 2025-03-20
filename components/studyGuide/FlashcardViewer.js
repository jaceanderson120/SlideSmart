import React, { useState } from "react";
import Button from "../Button";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import Flashcard from "./Flashcard";

const FlashcardViewer = ({ flashcards, isOpen, onRequestClose, icon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const onCloseClicked = () => {
    onRequestClose();
  };

  if (!flashcards || flashcards.length === 0) {
    return <div>No flashcards to show.</div>;
  }

  const { question, answer } = flashcards[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Flashcards"
      style={customStyles}
    >
      <ModalContent>
        {icon}
        <ModalTitle>Flashcards</ModalTitle>
        {/* Pass currentIndex to reset answer state when card changes */}
        <Flashcard
          question={question}
          answer={answer}
          cardIndex={currentIndex}
        />
        <ButtonSection>
          <Button
            onClick={onCloseClicked}
            backgroundColor="transparent"
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={({ theme }) => theme.fontSize.secondary}
            textColor={({ theme }) => theme.gray}
            hoverTextColor={({ theme }) => theme.primary}
            style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
          >
            Close
          </Button>
          <Button
            onClick={handlePrev}
            backgroundColor="transparent"
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={({ theme }) => theme.fontSize.secondary}
            textColor={({ theme }) => theme.gray}
            hoverTextColor={({ theme }) => theme.primary}
            style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            backgroundColor="transparent"
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={({ theme }) => theme.fontSize.secondary}
            textColor={({ theme }) => theme.gray}
            hoverTextColor={({ theme }) => theme.primary}
            style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
          >
            Next
          </Button>
          <CardNumber>
            Card {currentIndex + 1} of {flashcards.length}
          </CardNumber>
        </ButtonSection>
      </ModalContent>
    </Modal>
  );
};

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
`;

const ModalTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const CardNumber = styled.p`
  color: ${({ theme }) => theme.gray};
`;

export default FlashcardViewer;
