import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import TextField from "@mui/material/TextField";
import Button from "@/components/Button";
import { fontSize } from "@/constants/fontSize";
import { getPublicStudyGuides } from "@/firebase/database";
import StudyGuideList from "@/components/StudyGuideList";
import Footer from "@/components/Footer";
import { colors } from "@/constants/colors";
import keywordExtractor from "keyword-extractor";
import withAuth from "@/hoc/withAuth";

const FindSlides = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [inputText, setInputText] = useState("");
  const [studyGuides, setStudyGuides] = useState([]); // store fetched guides

  // Update local input state on every keystroke
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Trigger the search and update studyGuides state
  const handleSearch = async () => {
    // Extract the keywords from the search bar
    let keyWords = keywordExtractor.extract(inputText, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    setHasSearched(true);
    // When we decide on how to move foward with a more advanced search swap out the inputText for keyWords array and then handle that on the backend
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
    <>
      <PageContainer>
        <Navbar />
        <Section>
          <TopContainer>
            <PageTitle>Search for Public Slides</PageTitle>
          </TopContainer>
          <SearchContainer>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Enter a keyword..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch}>Search</Button>
          </SearchContainer>
          {hasSearched ? <StudyGuideList guides={studyGuides} /> : ""}
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
};

export default withAuth(FindSlides);

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${colors.lightGray};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  gap: 8px;
`;
