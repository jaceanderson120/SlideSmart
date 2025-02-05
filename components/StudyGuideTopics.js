import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";
import styled from "styled-components";

const StudyGuideTopics = ({
  topics,
  editMode,
  onDragEnd,
  setIsAddTopicDialogOpen,
  activeTopic,
  isTopicsShown,
  flex,
}) => {
  return (
    <Container isTopicsShown={isTopicsShown} flex={flex}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="topics">
          {(provided) => (
            <ContentContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {topics.map((topic, index) => (
                <Draggable key={topic} draggableId={topic} index={index}>
                  {(provided) => (
                    <TopicName
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={activeTopic === topic ? "active" : ""}
                      href={`#${topic}`}
                    >
                      {topic}
                    </TopicName>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {editMode && (
                <Button
                  backgroundColor="transparent"
                  textColor={colors.black}
                  hoverBackgroundColor={colors.primary70}
                  padding="8px"
                  marginTop="16px"
                  fontSize={fontSize.label}
                  onClick={() => {
                    setIsAddTopicDialogOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Topic
                </Button>
              )}
            </ContentContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default StudyGuideTopics;

const Container = styled.div`
  display: flex;
  flex: ${(props) => (props.flex ? props.flex : "0")};
  flex-direction: column;
  padding: 16px;
  background-color: transparent;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform 0.3s ease-in-out;
  transform: ${(props) =>
    props.isTopicsShown ? "translateX(0)" : "translateX(-100%)"};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TopicName = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: ${fontSize.label};
  text-decoration: none;
  color: ${colors.black};
  background-color: ${colors.primary33};
  transition: background-color 0.3s;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  white-space: normal;
  word-wrap: break-word;

  &:hover {
    background-color: ${colors.primary70};
  }

  &.active {
    background-color: ${colors.primary70};
    font-weight: bold;
    transition: font-weight 0.3s ease, color 0.3s ease;
  }
`;
