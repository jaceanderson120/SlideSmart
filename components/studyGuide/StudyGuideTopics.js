import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import { fontSize } from "@/constants/fontSize";
import styled from "styled-components";

const StudyGuideTopics = ({
  topics,
  editMode,
  onDragEnd,
  setIsAddTopicModalOpen,
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
            {editMode && (
              <Button
                backgroundColor="transparent"
                textColor={({ theme }) => theme.black}
                hoverBackgroundColor={({ theme }) => theme.primary70}
                padding="8px"
                marginTop="16px"
                fontSize={fontSize.label}
                onClick={() => {
                  setIsAddTopicModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Topic
              </Button>
            )}
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
            {provided.placeholder}
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
  gap: 8px;
  padding-bottom: 16px;
`;

const TopicName = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: ${fontSize.label};
  text-decoration: none;
  text-align: left;
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.primary33};
  transition: background-color 0.3s;
  box-shadow: 0px 2px 5px ${({ theme }) => theme.shadow};
  border-radius: 16px;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  word-break: break-word;
  hyphens: auto;

  &:hover {
    background-color: ${({ theme }) => theme.primary70};
  }

  &.active {
    background-color: ${({ theme }) => theme.primary70};
    font-weight: bold;
    transition: font-weight 0.3s ease, color 0.3s ease;
  }
`;
