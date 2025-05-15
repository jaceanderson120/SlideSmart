import { useState } from "react";
import { toast } from "react-toastify";
import {
  fetchFlashcards,
  updateStudyGuideHasFlashcards,
} from "@/firebase/database";

const useFlashcards = (id, hasSpark, hasFlashCards, setHasFlashCards) => {
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Function to handle opening the flashcard modal
  const handleFlashcardClick = async () => {
    if (!hasSpark) {
      toast.error(
        "You need to upgrade to the Spark Plan to create flashcards."
      );
      return;
    }
    if (!hasFlashCards) {
      setIsFlashcardModalOpen(true);
    } else {
      const flashcards = await fetchFlashcards(id);
      setFlashcards(flashcards);
      setShowFlashcards(true);
    }
  };

  // Function to close the flashcard modal
  const closeFlashcardModal = () => {
    setIsFlashcardModalOpen(false);
  };

  // Function to close the flashcards viewer
  const closeFlashcards = () => {
    setShowFlashcards(false);
  };

  // Function to swap between flashcard views
  const swapFlashcardViews = async () => {
    setShowFlashcards(false);
    setIsFlashcardModalOpen(true);
    setHasFlashCards(false);
    await updateStudyGuideHasFlashcards(id);
  };

  // Function to handle changes in flashcards
  const handleFlashcardChange = async (flashcardId) => {
    const newFlashcards = await fetchFlashcards(flashcardId);
    setFlashcards(newFlashcards);
  };

  // Function to handle flashcards created in the modal
  const handleFlashcardsCreated = (cards) => {
    setFlashcards(cards);
    setShowFlashcards(true);
    setHasFlashCards(true);
  };

  return {
    isFlashcardModalOpen,
    flashcards,
    showFlashcards,
    handleFlashcardClick,
    closeFlashcardModal,
    closeFlashcards,
    swapFlashcardViews,
    handleFlashcardChange,
    handleFlashcardsCreated,
  };
};

export default useFlashcards;
