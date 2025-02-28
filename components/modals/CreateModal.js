import React, { useRef, useState } from "react";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { toast } from "react-toastify";
import { fontSize } from "@/constants/fontSize";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button";

Modal.setAppElement("#__next");

const CreateModal = ({ isOpen, onRequestClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);
  const fileInputRef = useRef(null);
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
      boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.4)",
      maxWidth: "30%",
      height: "auto",
      padding: "24px",
      borderRadius: "16px",
    },
  };

  const handleClose = () => {
    // Reset local state
    setFile(null);
    setIsPublic(true);
    onRequestClose();
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
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
        <ModalTitle>Create a New Study Guide</ModalTitle>
        <ModalText>
          Please select a file to upload and choose what you would like to
          include in the study guide.
        </ModalText>
        <FileInput type="file" onChange={handleFileChange} ref={fileInputRef} />
        <Button
          onClick={handleFileInputClick}
          style={{
            maxWidth: "60%",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {file ? file.name : "Select File"}
        </Button>
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
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={fontSize.secondary}
            textColor={({ theme }) => theme.gray}
            hoverTextColor={({ theme }) => theme.primary}
            style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
          >
            Close
          </Button>
          <Button
            onClick={handleUploadClick}
            backgroundColor={({ theme }) => theme.primary}
            hoverBackgroundColor={({ theme }) => theme.primary}
            padding="12px"
            fontSize={fontSize.secondary}
            textColor={({ theme }) => theme.white}
            hoverTextColor={({ theme }) => theme.black}
          >
            Create
          </Button>
        </ButtonSection>
      </ModalContent>
    </Modal>
  );
};

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${({ theme }) => theme.gray};
  &:hover {
    transition: color 0.3s;
    color: ${({ theme }) => theme.primary};
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

const FileInput = styled.input`
  display: none;
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

export default CreateModal;
