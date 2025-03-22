import React, { useState, useEffect } from "react";
import Button from "../Button";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import {
  createIndividualFlashcard,
  deleteFlashcard,
} from "../../firebase/database";
import Flashcard from "./Flashcard";
import { ArrowLeft, ArrowRight, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import IconButton from "../IconButton";

const FlashcardViewer = ({
  studyGuideId,
  flashcards,
  isOpen,
  onRequestClose,
  onFlashcardsChanged,
  swapViews,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
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
    if (newFront.trim() === "" || newBack.trim() === "") {
      toast.error("Please enter text for the front and back of the flashcard.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // create the flashcard
      const newFlashcard = await createIndividualFlashcard(
        studyGuideId,
        newFront.trim(),
        newBack.trim()
      );

      // Only update local state if we have a valid response with an ID
      if (newFlashcard && newFlashcard.id) {
        // Temporarily update local state before backend refresh completes
        const updatedFlashcards = [...localFlashcards, newFlashcard];
        setLocalFlashcards(updatedFlashcards);
      }

      // Reset form
      setNewFront("");
      setNewBack("");
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

  const { front, back } = flashcards[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Flashcards"
      style={customStyles}
    >
      <ModalContent>
        {showAddForm ? (
          <AddFlashcardForm>
            <Input
              placeholder="Front"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
            />
            <Textarea
              placeholder="Back"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
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
            <Flashcard front={front} back={back} cardIndex={currentIndex} />
            <ButtonArea>
              <IconButton
                onClick={handlePrev}
                title="Previous Flashcard"
                icon={<ArrowLeft />}
              />
              <CardNumber>
                {currentIndex + 1} of {flashcards.length}
              </CardNumber>
              <IconButton
                onClick={handleNext}
                title="Next Flashcard"
                icon={<ArrowRight />}
              />
            </ButtonArea>
            <ButtonArea>
              <IconButton
                onClick={handleDeleteFlashcard}
                title="Delete Flashcard"
                disabled={isSubmitting}
                icon={<Trash2 />}
              />
              <IconButton
                onClick={() => setShowAddForm(true)}
                title="Add Flashcard"
                icon={<PlusCircle />}
              />
            </ButtonArea>
          </>
        )}
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

const CardNumber = styled.p`
  color: ${({ theme }) => theme.black};
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
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export default FlashcardViewer;
