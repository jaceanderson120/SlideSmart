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
  const [isPublic, setIsPublic] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);

  const handleClose = () => {
    // Reset local state
    setFile(null);
    setIsPublic(true);
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
    onUpload(
      file,
      isPublic,
      includeVideos,
      includeExamples,
      includeQuestions,
      includeResources
    );

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
          <ToggleArea>
            <ModalText>{isPublic ? "Public" : "Private"}</ModalText>
            <StyledFontAwesomeIcon
              icon={isPublic ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setIsPublic(!isPublic)}
            />
          </ToggleArea>
          <ToggleArea>
            <ModalText>Include Videos</ModalText>
            <StyledFontAwesomeIcon
              icon={includeVideos ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setIncludeVideos(!includeVideos)}
            />
          </ToggleArea>
          <ToggleArea>
            <ModalText>Include Examples</ModalText>
            <StyledFontAwesomeIcon
              icon={includeExamples ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setIncludeExamples(!includeExamples)}
            />
          </ToggleArea>
          <ToggleArea>
            <ModalText>Include Q/A</ModalText>
            <StyledFontAwesomeIcon
              icon={includeQuestions ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setIncludeQuestions(!includeQuestions)}
            />
          </ToggleArea>
          <ToggleArea>
            <ModalText>Include Resources</ModalText>
            <StyledFontAwesomeIcon
              icon={includeResources ? faToggleOn : faToggleOff}
              size="lg"
              onClick={() => setIncludeResources(!includeResources)}
            />
          </ToggleArea>
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
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ToggleArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
