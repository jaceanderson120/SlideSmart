import Modal from "react-modal";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "./Button";
import React from "react";

Modal.setAppElement("#__next");

const ConfirmationDialog = ({
  isOpen,
  title,
  text,
  onClose,
  onConfirm,
  icon,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Share Study Guide"
        style={customStyles}
      >
        <ModalContent>
          {icon}
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
              hoverBackgroundColor="transparent"
              padding="12px"
              fontSize={fontSize.secondary}
              textColor="#5c5c5c"
              hoverTextColor="#f03a47"
              style={{ border: "1px solid #5c5c5c" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              backgroundColor="#f03a47"
              hoverBackgroundColor="#f03a47"
              padding="12px"
              fontSize={fontSize.secondary}
              textColor="#ffffff"
              hoverTextColor="#000000"
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
  color: #5c5c5c;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

export default ConfirmationDialog;
