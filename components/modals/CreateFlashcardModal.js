import React, { useState } from "react";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { createFlashcards } from "@/firebase/database";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { toast } from "react-toastify";
import Button from "../Button";

Modal.setAppElement("#__next");

const CreateFlashcardModal = ({
  studyGuideId,
  studyGuide,
  isOpen,
  onRequestClose,
  onFlashcardsCreated,
  icon,
}) => {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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
    setIsLoading(true);
    const interval = setInterval(() => {
      setLoadingPercentage((prev) => {
        const newPercentage = prev + getRandomInRange(3, 5);
        return newPercentage > 100 ? 100 : newPercentage;
      });
    }, 1000);

    const response = await fetch("/api/create-flashcards-gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: studyGuide,
      }),
    });

    const rawData = await response.json();

    const newFlashcards = Object.entries(rawData).map(([q, a]) => ({
      front: q,
      back: a,
    }));

    const createdFlashcardsWithIds = await createFlashcards(
      studyGuideId,
      newFlashcards
    );

    setIsLoading(false);
    clearInterval(interval);

    toast.success("Flashcards Created Successfully");

    onFlashcardsCreated(createdFlashcardsWithIds);
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
          <ModalText>
            SlideSmart generates flashcards for you based on the content of your
            study guide.
          </ModalText>
          {isLoading ? (
            <Overlay>
              <ProgressWrapper>
                <CircularProgressbar
                  value={loadingPercentage}
                  text={`${loadingPercentage}%`}
                  styles={buildStyles({
                    pathColor: theme.primary,
                    textColor: theme.black,
                  })}
                />
              </ProgressWrapper>
            </Overlay>
          ) : (
            <></>
          )}
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

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  line-height: 1.3;
  color: ${({ theme }) => theme.gray};
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ProgressWrapper = styled.div`
  width: 100px;
  height: 100px;
`;

export default CreateFlashcardModal;
