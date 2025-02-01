import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { colors } from "@/constants/colors";

const StudyGuideList = ({ guides }) => {
  const router = useRouter();

  const handleClick = (guideId) => {
    router.push(`/study/${guideId}`);
  };

  if (!guides || guides.length === 0) {
    return <NoResults>No study guides found.</NoResults>;
  }

  return (
    <ListContainer>
      {guides.map((guide) => (
        <ListItem key={guide.id} onClick={() => handleClick(guide.id)}>
          {guide.fileName}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default StudyGuideList;

/* --- Styled components --- */
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
