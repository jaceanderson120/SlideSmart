import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "../Button";
import React from "react";

Modal.setAppElement("#__next");

const ConfirmationModal = ({
  isOpen,
  title,
  text,
  onClose,
  onConfirm,
  icon,
}) => {
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
      boxShadow: `4px 4px 4px ${({ theme }) => theme.shadow}`,
      maxWidth: "30%",
      height: "auto",
      padding: "24px",
      borderRadius: "16px",
    },
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
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
              textColor={({ theme }) => theme.gray}
              hoverTextColor={({ theme }) => theme.primary}
              style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
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

export default ConfirmationModal;
