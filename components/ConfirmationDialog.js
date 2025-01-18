import Modal from "react-modal";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "./Button";
import React from "react";

Modal.setAppElement("#__next");

const ConfirmationDialog = ({ isOpen, title, text, onClose, onConfirm }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          <ModalTitle>{title}</ModalTitle>
          <ModalText>
            {text.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </ModalText>
          <ButtonSection>
            <Button
              onClick={onClose}
              backgroundColor="transparent"
              hoverBackgroundColor="#f03a4770"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor="#f03a47"
              hoverTextColor="#f03a47"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              backgroundColor="transparent"
              hoverBackgroundColor="#f03a4770"
              padding="8px"
              fontSize={fontSize.secondary}
              textColor="#f03a47"
              hoverTextColor="#f03a47"
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
    background-color: #000000;
    margin-top: 10px;
  }
`;

const ModalText = styled.p`
  font-size: ${fontSize.secondary};
  line-height: 1.3;
`;

export default ConfirmationDialog;
