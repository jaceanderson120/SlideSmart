import React, { useState, useEffect } from "react";
import Button from "../Button";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import {
  createIndividualFlashcard,
  deleteFlashcard,
} from "../../firebase/database";
import Flashcard from "./Flashcard";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const FlashcardViewer = ({
  studyGuideId,
  flashcards,
  isOpen,
  onRequestClose,
  onFlashcardsChanged,
  swapViews,
  icon,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFlashcards, setLocalFlashcards] = useState(flashcards);

  useEffect(() => {
    setLocalFlashcards(flashcards);
  }, [flashcards]);

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

  const handleAddFlashcard = async () => {
    if (newQuestion.trim() === "" || newAnswer.trim() === "") {
      toast("Please enter a question and answer.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // create the flashcard
      const newFlashcard = await createIndividualFlashcard(
        studyGuideId,
        newQuestion.trim(),
        newAnswer.trim()
      );

      // Only update local state if we have a valid response with an ID
      if (newFlashcard && newFlashcard.id) {
        // Temporarily update local state before backend refresh completes
        const updatedFlashcards = [...localFlashcards, newFlashcard];
        setLocalFlashcards(updatedFlashcards);
      }

      // Reset form
      setNewQuestion("");
      setNewAnswer("");
      setShowAddForm(false);

      // Refresh flashcards list from backend
      if (onFlashcardsChanged) {
        onFlashcardsChanged(studyGuideId);
      }
    } catch (error) {
      console.error("Error adding flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFlashcard = async () => {
    if (!localFlashcards || localFlashcards.length === 0) return;
    if (isSubmitting) return;

    const currentFlashcard = localFlashcards[currentIndex];

    // Make sure we have a valid flashcard with an id
    if (!currentFlashcard || !currentFlashcard.id) {
      console.error("Invalid flashcard or missing ID:", currentFlashcard);
      return;
    }

    try {
      setIsSubmitting(true);

      // delete the flashcard
      if (localFlashcards.length <= 1) {
        await deleteFlashcard(currentFlashcard.id);
        await swapViews();
        return;
      } else {
        // delete the flashcard
        await deleteFlashcard(currentFlashcard.id);
      }

      // Temporarily update local state before backend refresh completes
      setLocalFlashcards((prevFlashcards) =>
        prevFlashcards.filter((card) => card.id !== currentFlashcard.id)
      );

      // Adjust index if needed
      if (currentIndex >= localFlashcards.length) {
        setCurrentIndex(Math.max(0, localFlashcards.length - 1));
      }

      // Refresh flashcards list from backend
      if (onFlashcardsChanged) {
        onFlashcardsChanged(studyGuideId);
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
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

        {showAddForm ? (
          <AddFlashcardForm>
            <Input
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Textarea
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={4}
            />
            <ButtonRow>
              <Button
                onClick={() => setShowAddForm(false)}
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                padding="12px"
                fontSize={theme.fontSize.secondary}
                textColor={theme.gray}
                hoverTextColor={theme.primary}
                style={{ border: `1px solid ${theme.gray}` }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFlashcard}
                backgroundColor={theme.primary}
                hoverBackgroundColor={theme.primaryDark}
                padding="12px"
                fontSize={theme.fontSize.secondary}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Flashcard"}
              </Button>
            </ButtonRow>
          </AddFlashcardForm>
        ) : (
          <>
            <Flashcard
              question={question}
              answer={answer}
              cardIndex={currentIndex}
            />
            <ManagementButtonRow>
              <IconButton
                onClick={() => setShowAddForm(true)}
                title="Add Flashcard"
              >
                <PlusCircle size={20} color={theme.primary} />
              </IconButton>
              <IconButton
                onClick={handleDeleteFlashcard}
                title="Delete Flashcard"
                disabled={isSubmitting}
              >
                <Trash2 size={20} color={theme.error || "red"} />
              </IconButton>
            </ManagementButtonRow>
          </>
        )}

        <ButtonSection>
          <Button
            onClick={onCloseClicked}
            backgroundColor="transparent"
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={theme.fontSize.secondary}
            textColor={theme.gray}
            hoverTextColor={theme.primary}
            style={{ border: `1px solid ${theme.gray}` }}
          >
            Close
          </Button>

          {!showAddForm && (
            <>
              <Button
                onClick={handlePrev}
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                padding="12px"
                fontSize={theme.fontSize.secondary}
                textColor={theme.gray}
                hoverTextColor={theme.primary}
                style={{ border: `1px solid ${theme.gray}` }}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                padding="12px"
                fontSize={theme.fontSize.secondary}
                textColor={theme.gray}
                hoverTextColor={theme.primary}
                style={{ border: `1px solid ${theme.gray}` }}
              >
                Next
              </Button>
              <CardNumber>
                Card {currentIndex + 1} of {flashcards.length}
              </CardNumber>
            </>
          )}
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

const AddFlashcardForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.gray};
  font-size: ${({ theme }) => theme.fontSize.secondary};
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.gray};
  font-size: ${({ theme }) => theme.fontSize.secondary};
  width: 100%;
  resize: vertical;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ManagementButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: -16px 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.lightGray};
  }
`;

export default FlashcardViewer;
