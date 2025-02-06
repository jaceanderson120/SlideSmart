import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { colors } from "@/constants/colors";

const StudyGuideList = ({ guides }) => {
  const router = useRouter();
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleClick = (guideId) => {
    router.push(`/study/${guideId}`);
  };

  const handleGuideSelect = (guide) => {
    setSelectedGuide(guide);
  };

  if (!guides || guides.length === 0) {
    return <NoResults>No study guides found.</NoResults>;
  }

  return (
    <Container>
      <ListContainer>
        {guides.map((guide) => (
          <ListItem key={guide.id} onClick={() => handleGuideSelect(guide)}>
            <FileName>{guide.fileName}</FileName>
            <TopicsList>
              {guide.topics?.slice(0, 3).map((topic, index) => (
                <Topic key={index}>{topic}</Topic>
              ))}
              {guide.topics?.length > 3 && (
                <Topic>+{guide.topics.length - 3} more</Topic>
              )}
            </TopicsList>
          </ListItem>
        ))}
      </ListContainer>

      {selectedGuide && (
        <TopicsPanel>
          <PanelHeader>
            <h3>{selectedGuide.fileName}</h3>
            <CloseButton onClick={() => setSelectedGuide(null)}>×</CloseButton>
          </PanelHeader>
          <PanelContent>
            <AllTopicsList>
              {selectedGuide.topics?.map((topic, index) => (
                <Topic key={index}>{topic}</Topic>
              ))}
            </AllTopicsList>
            <ViewButton onClick={() => handleClick(selectedGuide.id)}>
              View Study Guide
            </ViewButton>
          </PanelContent>
        </TopicsPanel>
      )}
    </Container>
  );
};

export default StudyGuideList;

/* --- Styled components --- */
const Container = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  justify-content: center;
`;

const ListContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  max-width: 600px;
`;

const ListItem = styled.div`
  background: ${colors.white};
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${colors.lightGray};
  }
`;

const NoResults = styled.div`
  margin-top: 16px;
  color: ${colors.black};
`;

const TopicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Topic = styled.span`
  background: ${colors.lightGray};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const FileName = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const TopicsPanel = styled.div`
  position: sticky;
  top: 16px;
  background: ${colors.white};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  height: fit-content;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: ${colors.black};

  &:hover {
    color: ${colors.primary};
  }
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
  max-height: 200px;
  overflow-y: auto;
`;

const ViewButton = styled.button`
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;

  &:hover {
    background: ${colors.primaryDark};
  }
`;
