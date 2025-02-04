import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip, faPlus } from "@fortawesome/free-solid-svg-icons";
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
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="topics">
        {(provided) => (
          <ContentContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {topics.map((topic, index) => (
              <Draggable
                key={topic}
                draggableId={topic}
                index={index}
                isDragDisabled={!editMode}
              >
                {(provided) => (
                  <TopicName
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={activeTopic === topic ? "active" : ""}
                    href={`#${topic}`}
                  >
                    {topic}
                    {editMode && <FontAwesomeIcon icon={faGrip} />}
                  </TopicName>
                )}
              </Draggable>
            ))}
            {/* Placeholder to maintain the space that the dragged item would occupy */}
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
  );
};

export default StudyGuideTopics;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.75;
  background-color: transparent;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const TopicName = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  padding: 16px;
  margin-right: 16px;
  margin-left: 16px;
  font-size: ${fontSize.label};
  text-decoration: none;
  color: inherit;
  background-color: ${colors.primary33};
  transition: background-color 0.3s;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  // wrap text
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
