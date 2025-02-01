import styled from "styled-components";
import Button from "./Button";
import { colors } from "@/constants/colors";

const AddSectionsContainer = ({ topicInfo, handleAddSection }) => {
  return (
    <Container>
      {!topicInfo["explanation"] && topicInfo["explanation"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={colors.primary70}
          hoverBackgroundColor={colors.primary70}
          textColor={colors.black}
          hoverTextColor={colors.white}
          onClick={() => handleAddSection("explanation")}
        >
          Add Explanation
        </Button>
      )}
      {!topicInfo["youtubeIds"] && (
        <Button
          padding="8px"
          backgroundColor={colors.primary70}
          hoverBackgroundColor={colors.primary70}
          textColor={colors.black}
          hoverTextColor={colors.white}
          onClick={() => handleAddSection("youtubeIds")}
        >
          Add Video
        </Button>
      )}
      {!topicInfo["example"] && topicInfo["example"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={colors.primary70}
          hoverBackgroundColor={colors.primary70}
          textColor={colors.black}
          hoverTextColor={colors.white}
          onClick={() => handleAddSection("example")}
        >
          Add Example
        </Button>
      )}
      {!topicInfo["question"] && topicInfo["question"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={colors.primary70}
          hoverBackgroundColor={colors.primary70}
          textColor={colors.black}
          hoverTextColor={colors.white}
          onClick={() => handleAddSection("question")}
        >
          Add Question
        </Button>
      )}
      {!topicInfo["answer"] && topicInfo["answer"] !== "" && (
        <Button
          padding="8px"
          backgroundColor={colors.primary70}
          hoverBackgroundColor={colors.primary70}
          textColor={colors.black}
          hoverTextColor={colors.white}
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
