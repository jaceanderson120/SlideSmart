import Modal from "react-modal";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "./Button";
import { useState } from "react";
import { colors } from "@/constants/colors";

Modal.setAppElement("#__next");

const AddTopicDialog = ({ isOpen, onClose, onConfirm }) => {
  const [topicName, setTopicName] = useState("");

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          <ModalTitle>Add New Topic</ModalTitle>
          <ModalInput
            placeholder="Enter topic name"
            value={topicName}
            onChange={(event) => setTopicName(event.target.value)}
          />
          <ButtonSection>
            <Button
              onClick={() => {
                setTopicName("");
                onClose();
              }}
              backgroundColor="transparent"
              hoverBackgroundColor="{colors.primary70}"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor={colors.primary}
              hoverTextColor={colors.primary}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm(topicName);
                setTopicName("");
                onClose();
              }}
              backgroundColor="transparent"
              hoverBackgroundColor="{colors.primary70}"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor={colors.primary}
              hoverTextColor={colors.primary}
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
    backgroundColor: "#f6f4f3",
    border: "none",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
    maxWidth: "40%",
    height: "25%",
  },
};

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
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
    background-color: ${colors.black};
    margin-top: 10px;
  }
`;

const ModalInput = styled.input`
  font-size: ${fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
`;

export default AddTopicDialog;
