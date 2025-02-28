import styled from "styled-components";
import Button from "../Button";

const AddSectionsContainer = ({ topicInfo, handleAddSection }) => {
  return (
    <Container>
      {!topicInfo["explanation"] && topicInfo["explanation"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={({ theme }) => theme.primary70}
          hoverBackgroundColor={({ theme }) => theme.primary70}
          textColor={({ theme }) => theme.black}
          hoverTextColor={({ theme }) => theme.white}
          onClick={() => handleAddSection("explanation")}
        >
          Add Explanation
        </Button>
      )}
      {!topicInfo["youtubeIds"] && (
        <Button
          padding="8px"
          backgroundColor={({ theme }) => theme.primary70}
          hoverBackgroundColor={({ theme }) => theme.primary70}
          textColor={({ theme }) => theme.black}
          hoverTextColor={({ theme }) => theme.white}
          onClick={() => handleAddSection("youtubeIds")}
        >
          Add Video
        </Button>
      )}
      {!topicInfo["example"] && topicInfo["example"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={({ theme }) => theme.primary70}
          hoverBackgroundColor={({ theme }) => theme.primary70}
          textColor={({ theme }) => theme.black}
          hoverTextColor={({ theme }) => theme.white}
          onClick={() => handleAddSection("example")}
        >
          Add Example
        </Button>
      )}
      {!topicInfo["question"] && topicInfo["question"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={({ theme }) => theme.primary70}
          hoverBackgroundColor={({ theme }) => theme.primary70}
          textColor={({ theme }) => theme.black}
          hoverTextColor={({ theme }) => theme.white}
          onClick={() => {
            handleAddSection("question");
            handleAddSection("answer");
          }}
        >
          Add Q/A
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
