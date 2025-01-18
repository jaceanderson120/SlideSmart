import styled from "styled-components";
import Button from "./Button";

const AddSectionsContainer = ({ topicInfo, handleAddSection }) => {
  return (
    <Container>
      {!topicInfo["summary"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("summary")}
        >
          Add Summary
        </Button>
      )}
      {!topicInfo["youtubeId"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("youtubeId")}
        >
          Add Video
        </Button>
      )}
      {!topicInfo["example"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("example")}
        >
          Add Example
        </Button>
      )}
      {!topicInfo["question"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("question")}
        >
          Add Question
        </Button>
      )}
      {!topicInfo["answer"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("answer")}
        >
          Add Answer
        </Button>
      )}
    </Container>
  );
};

export default AddSectionsContainer;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
`;
