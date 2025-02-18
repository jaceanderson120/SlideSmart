import Modal from "react-modal";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "../Button";
import { useState } from "react";
import { colors } from "@/constants/colors";

Modal.setAppElement("#__next");

const AddTopicModal = ({ isOpen, onClose, onConfirm }) => {
  const [topicName, setTopicName] = useState("");
  const [topicExplanation, setTopicExplanation] = useState("");

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
              textColor={colors.gray}
              hoverTextColor={colors.primary}
              style={{ border: `1px solid ${colors.gray}` }}
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
              backgroundColor={colors.primary}
              hoverBackgroundColor={colors.primary}
              padding="12px"
              fontSize={fontSize.secondary}
              textColor={colors.white}
              hoverTextColor={colors.black}
            >
              Confirm
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
`;

const ModalText = styled.p`
  font-size: ${fontSize.secondary};
  line-height: 1.3;
  color: ${colors.gray};
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const ModalInput = styled.input`
  font-size: ${fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ModalTextArea = styled.textarea`
  font-size: ${fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
  resize: none;
  height: 100px;
`;

export default AddTopicModal;
