import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { getUserUidFromEmail, shareStudyGuide } from "@/firebase/database";
import { ToastContainer, toast } from "react-toastify";
import { useStateContext } from "@/context/StateContext";

Modal.setAppElement("#__next");

const ShareModal = ({ studyGuideId, isOpen, onRequestClose }) => {
  const [shareEmail, setShareEmail] = useState("");
  const { currentUser } = useStateContext();

  // Share the study guide with the entered email
  const onShareClicked = async () => {
    // Check if an email address was entered
    if (!shareEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    // Check if the email address is the user's own email
    if (shareEmail === currentUser.email) {
      toast.error("You cannot share a study guide with yourself.");
      return;
    }
    // Get the uid of the user with the entered email
    const uid = await getUserUidFromEmail(shareEmail);
    if (!uid) {
      toast.error("User not found. Please try a different email address.");
      return;
    }
    // Share the study guide with the user
    await shareStudyGuide(studyGuideId, uid);
    toast.success("Study guide shared successfully!");
    setShareEmail("");
    onRequestClose();
  };

  // Clear the selected users and search term when the modal is closed
  const onCloseClicked = () => {
    onRequestClose();
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          <h2>Share Study Guide</h2>
          <EmailField
            type="text"
            placeholder="Enter an email address..."
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <HorizontalSection>
            <CloseButton onClick={onCloseClicked}>Close</CloseButton>
            <ShareButton onClick={onShareClicked}>Share</ShareButton>
          </HorizontalSection>
        </ModalContent>
      </Modal>
    </>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f6f4f3",
  },
};

const HorizontalSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmailField = styled.input`
  width: 100%;
  padding: 8px;
  margin: 16px 0;
  font-size: 1rem;
`;

const CloseButton = styled.button`
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: black;
  }
`;

const ShareButton = styled.button`
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background-color: #f6f4f3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #f03a47;
  }
`;

export default ShareModal;
