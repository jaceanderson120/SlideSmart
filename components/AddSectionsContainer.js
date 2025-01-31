import styled from "styled-components";
import Button from "./Button";

const AddSectionsContainer = ({ topicInfo, handleAddSection }) => {
  return (
    <Container>
      {!topicInfo["explanation"] && topicInfo["explanation"] !== "" && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("explanation")}
        >
          Add Explanation
        </Button>
      )}
      {!topicInfo["youtubeIds"] && (
        <Button
          padding="8px"
          backgroundColor="#f03a4770"
          hoverBackgroundColor="#f03a4770"
          textColor="#000000"
          hoverTextColor="#ffffff"
          onClick={() => handleAddSection("youtubeIds")}
        >
          Add Video
        </Button>
      )}
      {!topicInfo["example"] && topicInfo["example"] !== "" && (
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
      {!topicInfo["question"] && topicInfo["question"] !== "" && (
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
      {!topicInfo["answer"] && topicInfo["answer"] !== "" && (
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
