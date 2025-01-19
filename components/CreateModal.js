import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { toast } from "react-toastify";
import { fontSize } from "@/constants/fontSize";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

Modal.setAppElement("#__next");

const CreateModal = ({ isOpen, onRequestClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isGlobal, setIsGlobal] = useState(true);

  const handleClose = () => {
    // Reset local state
    setFile(null);
    setIsGlobal(true);
    onRequestClose();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    // Call the parent callback
    onUpload(file, isGlobal);

    // Close modal afterwards
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Upload File"
    >
      <ModalContent>
        <ModalTitle>Upload a File</ModalTitle>
        <FileInput type="file" onChange={handleFileChange} />

        <ToggleSection>
          <ModalText>{isGlobal ? "Public" : "Private"}</ModalText>
          <StyledFontAwesomeIcon
            icon={isGlobal ? faToggleOn : faToggleOff}
            size="lg"
            onClick={() => setIsGlobal(!isGlobal)}
          />
        </ToggleSection>

        <ButtonSection>
          <Button
            onClick={handleClose}
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
            onClick={handleUploadClick}
            backgroundColor="transparent"
            hoverBackgroundColor="#f03a4770"
            padding="8px"
            fontSize={fontSize.secondary}
            textColor="#f03a47"
            hoverTextColor="#f03a47"
          >
            Submit
          </Button>
        </ButtonSection>
      </ModalContent>
    </Modal>
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

const FileInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 16px 0;
  font-size: ${fontSize.secondary};
`;

const ToggleSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

export default CreateModal;
