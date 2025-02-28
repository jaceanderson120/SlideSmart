import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "../Button";
import { useState } from "react";

Modal.setAppElement("#__next");

const AddTopicModal = ({ isOpen, onClose, onConfirm }) => {
  const [topicName, setTopicName] = useState("");
  const [topicExplanation, setTopicExplanation] = useState("");
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
      boxShadow: "4px 4px 4px ${({ theme }) => theme.black}",
      maxWidth: "30%",
      height: "auto",
      padding: "24px",
      borderRadius: "16px",
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          <ModalTitle>Create a Study Guide Topic</ModalTitle>
          <ModalInput
            placeholder="Enter a topic name..."
            value={topicName}
            onChange={(event) => setTopicName(event.target.value)}
          />
          <ModalTextArea
            placeholder="Enter a topic explanation..."
            value={topicExplanation}
            onChange={(event) => setTopicExplanation(event.target.value)}
          />
          <ModalText>
            Please enter a topic name and explanation above. For the best
            experience, explain the topic clearly.
          </ModalText>
          <ButtonSection>
            <Button
              onClick={() => {
                setTopicName("");
                setTopicExplanation("");
                onClose();
              }}
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              padding="12px"
              fontSize={fontSize.secondary}
              textColor={({ theme }) => theme.gray}
              hoverTextColor={({ theme }) => theme.primary}
              style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm(topicName, topicExplanation);
                setTopicName("");
                setTopicExplanation("");
                onClose();
              }}
              backgroundColor={({ theme }) => theme.primary}
              hoverBackgroundColor={({ theme }) => theme.primary}
              padding="12px"
              fontSize={fontSize.secondary}
              textColor={({ theme }) => theme.white}
              hoverTextColor={({ theme }) => theme.black}
            >
              Confirm
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
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const ModalText = styled.p`
  font-size: ${fontSize.secondary};
  line-height: 1.3;
  color: ${({ theme }) => theme.gray};
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const ModalInput = styled.input`
  font-size: ${fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px ${({ theme }) => theme.black};
  width: 100%;
`;

const ModalTextArea = styled.textarea`
  font-size: ${fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px ${({ theme }) => theme.black};
  width: 100%;
  resize: none;
  height: 100px;
`;

export default AddTopicModal;
