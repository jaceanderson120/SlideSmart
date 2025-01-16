import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { getUserUidFromEmail, shareStudyGuide } from "@/firebase/database";
import { toast } from "react-toastify";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

Modal.setAppElement("#__next");

const ShareModal = ({ studyGuideId, isOpen, onRequestClose }) => {
  const [shareEmail, setShareEmail] = useState("");
  const [allowEditing, setAllowEditing] = useState(false);
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
    await shareStudyGuide(studyGuideId, uid, allowEditing);
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
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          <ModalTitle>Share Study Guide</ModalTitle>
          <EmailField
            type="text"
            placeholder="Enter an email address..."
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <AllowEditingSection>
            <ModalText>Allow Editing</ModalText>
            <StyledFontAwesomeIcon
              icon={allowEditing ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setAllowEditing(!allowEditing)}
            />
          </AllowEditingSection>
          <ButtonSection>
            <Button
              onClick={onCloseClicked}
              backgroundColor="transparent"
              hoverBackgroundColor="#f03a4770"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor="#f03a47"
              hoverTextColor="#f03a47"
            >
              Close
            </Button>
            <Button
              onClick={onShareClicked}
              backgroundColor="transparent"
              hoverBackgroundColor="#f03a4770"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor="#f03a47"
              hoverTextColor="#f03a47"
            >
              Share
            </Button>
          </ButtonSection>
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
    border: "none",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
    maxWidth: "20%",
  },
};

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ModalTitle = styled.p`
  font-size: ${fontSize.subheading};
  font-weight: bold;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: #000000;
    margin-top: 10px;
  }
`;

const ModalText = styled.p`
  font-size: ${fontSize.secondary};
  line-height: 1.3;
`;

const EmailField = styled.input`
  width: 100%;
  padding: 8px;
  margin: 16px 0;
  font-size: ${fontSize.secondary};
`;

const AllowEditingSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

export default ShareModal;
