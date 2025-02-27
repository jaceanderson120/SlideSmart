import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";
import Button from "../Button";
import { trackClickThrough } from "@/firebase/database";

const StudyGuideList = ({ guides }) => {
  const router = useRouter();
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleClick = async (guideId) => {
    await trackClickThrough();
    router.push(`/study/${guideId}`);
  };

  const handleGuideSelect = (guide) => {
    if (selectedGuide === guide) {
      setSelectedGuide(null);
      return;
    }
    setSelectedGuide(guide);
  };

  return (
    <Container>
      {guides.length > 0 ? (
        guides.map((guide) => (
          <ListItem key={guide.id} onClick={() => handleGuideSelect(guide)}>
            <FileName>{guide.fileName}</FileName>
            <TopicsList>
              {selectedGuide !== guide &&
                guide.topics
                  ?.slice(0, 3)
                  .map((topic, index) => <Topic key={index}>{topic}</Topic>)}
              {selectedGuide !== guide && guide.topics?.length > 3 && (
                <Topic>+ {guide.topics.length - 3} more</Topic>
              )}
              {selectedGuide === guide && (
                <PanelContent>
                  <AllTopicsList>
                    {selectedGuide.topics?.map((topic, index) => (
                      <Topic key={index}>{topic}</Topic>
                    ))}
                  </AllTopicsList>
                  <Button
                    onClick={() => handleClick(selectedGuide.id)}
                    backgroundColor="transparent"
                    hoverBackgroundColor="transparent"
                    textColor={colors.primary}
                  >
                    View Study Guide
                  </Button>
                </PanelContent>
              )}
            </TopicsList>
          </ListItem>
        ))
      ) : (
        <NoResults>
          No study guides found. Please try searching for something else.
        </NoResults>
      )}
    </Container>
  );
};

export default StudyGuideList;

const Container = styled.div`
  display: flex;
  gap: 12px;
  max-height: 600px;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);
  border-left: 4px solid ${colors.primary33};
  border-top: 4px solid ${colors.primary33};
  padding: 16px;
  background: ${colors.white};
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${colors.lightGray};
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: scale 0.3s;
  text-align: left;
  word-break: break-word;

  &:hover {
    scale: 1.02;
  }
`;

const NoResults = styled.div`
  color: ${colors.black};
`;

const TopicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Topic = styled.div`
  display: flex;
  background: ${colors.white};
  color: ${colors.black};
  padding: 8px;
  border-radius: 12px;
  font-size: ${fontSize.secondary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const FileName = styled.div`
  font-size: ${fontSize.default};
  font-weight: bold;
  color: ${colors.black};
`;

const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AllTopicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
