import React, { useState } from "react";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { createFlashcards, fetchStudyGuide } from "@/firebase/database";
import { toast } from "react-toastify";
import Button from "../Button";

Modal.setAppElement("#__next");

const CreateFlashcardModal = ({
  studyGuideId,
  isOpen,
  onRequestClose,
  onFlashcardsCreated,
  icon,
}) => {
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

  // Create the flashcards for the associated study guide
  const onCreateClicked = async () => {
    let studyGuide = await fetchStudyGuide(studyGuideId);

    const response = await fetch("/api/create-flashcards-gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: studyGuide.fetchedStudyGuide.extractedData,
      }),
    });

    const rawData = await response.json();

    const newFlashcards = Object.entries(rawData).map(([q, a]) => ({
      question: q,
      answer: a,
    }));

    await createFlashcards(studyGuideId, newFlashcards);

    toast.success("Flashcards Created Successfully");

    onFlashcardsCreated(newFlashcards);
    onRequestClose();
  };

  // Clear the selected users and search term when the modal is closed
  const onCloseClicked = () => {
    onRequestClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Create Flashcards"
        style={customStyles}
      >
        <ModalContent>
          {icon}
          <ModalTitle>Create Flashcards</ModalTitle>
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
              onClick={onCreateClicked}
              backgroundColor={({ theme }) => theme.primary}
              hoverBackgroundColor={({ theme }) => theme.primary}
              padding="12px"
              fontSize={({ theme }) => theme.fontSize.secondary}
              textColor={({ theme }) => theme.white}
              hoverTextColor={({ theme }) => theme.black}
            >
              Create
            </Button>
          </ButtonSection>
        </ModalContent>
      </Modal>
    </>
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

export default CreateFlashcardModal;
