import React, { useRef, useState } from "react";
import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import { toast } from "react-toastify";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button";
import OrLine from "../auth/OrLine";
import { useStateContext } from "@/context/StateContext";

Modal.setAppElement("#__next");

const CreateModal = ({ isOpen, onRequestClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);
  const [topic, setTopic] = useState("");
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const { hasSpark } = useStateContext();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.lightGray,
      border: "none",
      boxShadow: `4px 4px 4px ${theme.shadow}`,
      width: "90%",
      maxWidth: "400px",
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
    setTopic("");
  };

  const handleUploadClick = async () => {
    if (!file && !topic) {
      toast.error(
        "Please select a file to upload or enter a topic to learn about."
      );
      return;
    }

    // If the user does not have spark, do not allow creating study guide without a file
    if (!hasSpark && !file) {
      toast.error(
        "Please upgrade to Spark Plan to create study guides without a file!"
      );
      return;
    }

    // Call the parent callback
    onUpload(
      file,
      isPublic,
      includeVideos,
      includeExamples,
      includeQuestions,
      includeResources,
      topic
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
        <ModalText>Please select a file to upload.</ModalText>
        <FileInput type="file" onChange={handleFileChange} ref={fileInputRef} />
        {!topic && (
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
        )}
        {!file && !topic && <OrLine />}
        {!file && (
          <ModalInput
            placeholder="Enter a topic that you want to learn about..."
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
        )}
        <ToggleSection>
          <ModalText>
            Please choose whether you would like to make this study guide public
            or private.
          </ModalText>
          <ButtonArea>
            <Button
              onClick={() => setIsPublic(true)}
              backgroundColor={isPublic ? theme.primary : theme.white}
              textColor={isPublic ? theme.white : theme.black}
            >
              Public
            </Button>
            <ModalText>OR</ModalText>
            <Button
              onClick={() => setIsPublic(false)}
              backgroundColor={!isPublic ? theme.primary : theme.white}
              textColor={!isPublic ? theme.white : theme.black}
            >
              Private
            </Button>
          </ButtonArea>
        </ToggleSection>
        <ToggleSection>
          <ModalText>
            What would you like to include in the study guide?
          </ModalText>
          <ToggleArea>
            <ToggleButton
              icon={includeVideos ? faToggleOn : faToggleOff}
              style={{ color: includeVideos ? theme.primary : theme.gray }}
              size="2xl"
              onClick={() => setIncludeVideos(!includeVideos)}
            />
            <ModalText>Videos</ModalText>
          </ToggleArea>
          <ToggleArea>
            <ToggleButton
              icon={includeExamples ? faToggleOn : faToggleOff}
              style={{ color: includeExamples ? theme.primary : theme.gray }}
              size="2xl"
              onClick={() => setIncludeExamples(!includeExamples)}
            />
            <ModalText>Examples</ModalText>
          </ToggleArea>
          <ToggleArea>
            <ToggleButton
              icon={includeQuestions ? faToggleOn : faToggleOff}
              style={{ color: includeQuestions ? theme.primary : theme.gray }}
              size="2xl"
              onClick={() => setIncludeQuestions(!includeQuestions)}
            />
            <ModalText>Practice Questions</ModalText>
          </ToggleArea>
          <ToggleArea>
            <ToggleButton
              icon={includeResources ? faToggleOn : faToggleOff}
              style={{ color: includeResources ? theme.primary : theme.gray }}
              size="2xl"
              onClick={() => setIncludeResources(!includeResources)}
            />
            <ModalText>Extra Resources</ModalText>
          </ToggleArea>
        </ToggleSection>
        <ButtonSection>
          <Button
            onClick={handleClose}
            backgroundColor="transparent"
            hoverBackgroundColor="transparent"
            padding="12px"
            fontSize={({ theme }) => theme.fontSize.secondary}
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
            fontSize={({ theme }) => theme.fontSize.secondary}
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

const ToggleButton = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const ModalInput = styled.input`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px ${({ theme }) => theme.shadow};
  width: 100%;
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
  font-size: ${({ theme }) => theme.fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.secondary};
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
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
  margin-top: 8px;
`;

const ToggleArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 8px;
`;

export default CreateModal;
