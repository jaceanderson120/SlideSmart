import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { fontSize } from "@/constants/fontSize";
import { getPublicStudyGuides } from "@/firebase/database";
import StudyGuideList from "./StudyGuideList"; // <-- We'll create this next

const SearchBar = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [inputText, setInputText] = useState("");
  const [studyGuides, setStudyGuides] = useState([]); // store fetched guides

  // Update local input state on every keystroke
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Trigger the search and update studyGuides state
  const handleSearch = async () => {
    // Pass the search term to your getPublicStudyGuides
    setHasSearched(true);
    const guides = await getPublicStudyGuides(inputText);
    setStudyGuides(guides);
  };

  // If user presses 'Enter', run the same search function
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <Navbar />
      <Section>
        <TopContainer>
          <PageTitle>Search for Public Slides</PageTitle>
        </TopContainer>
      </Section>

      <Section>
        <SearchContainer>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Search"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </SearchContainer>

        {/* 
          Render the StudyGuideList component, which shows each guide's name
          and clicks through to the guide.
        */}
        {hasSearched ? <StudyGuideList guides={studyGuides} /> : ""}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f4f3;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  text-align: center;
  margin-bottom: 32px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 32px;
`;

const PageTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  flex: 1;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Space between the textfield and the button */
`;

export default SearchBar;
