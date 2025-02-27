import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { getUserUidFromEmail, shareStudyGuide } from "@/firebase/database";
import { toast } from "react-toastify";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button";
import { colors } from "@/constants/colors";

Modal.setAppElement("#__next");

const ShareModal = ({ studyGuideId, isOpen, onRequestClose, icon }) => {
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
          {icon}
          <ModalTitle>Share Study Guide</ModalTitle>
          <EmailField
            type="text"
            placeholder="Enter an email address..."
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <ModalText>
            Please enter the email address of the user you want to share this
            study guide with.
          </ModalText>
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
              hoverBackgroundColor="transparent"
              padding="12px"
              fontSize={fontSize.secondary}
              textColor={colors.gray}
              hoverTextColor={colors.primary}
              style={{ border: `1px solid ${colors.gray}` }}
            >
              Close
            </Button>
            <Button
              onClick={onShareClicked}
              backgroundColor={colors.primary}
              hoverBackgroundColor={colors.primary}
              padding="12px"
              fontSize={fontSize.secondary}
              textColor={colors.white}
              hoverTextColor={colors.black}
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
    transform: "translate(-50%, -50%)",
    backgroundColor: colors.lightGray,
    border: "none",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.4)",
    maxWidth: "30%",
    height: "auto",
    padding: "24px",
    borderRadius: "16px",
  },
};

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${colors.gray};
  &:hover {
    transition: color 0.3s;
    color: ${colors.primary};
  }
`;

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
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: ${colors.black};
`;

const ModalText = styled.p`
  font-size: ${fontSize.secondary};
  line-height: 1.3;
  color: ${colors.gray};
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const EmailField = styled.input`
  width: 100%;
  padding: 8px;
  font-size: ${fontSize.secondary};
`;

const AllowEditingSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export default ShareModal;
