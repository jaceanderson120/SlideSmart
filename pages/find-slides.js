import React, { useState } from "react";
import styled from "styled-components";
import Button from "@/components/Button";
import { fontSize } from "@/constants/fontSize";
import { getPublicStudyGuides } from "@/firebase/database";
import StudyGuideList from "@/components/findSlides/StudyGuideList";
import Footer from "@/components/page/Footer";
import keywordExtractor from "keyword-extractor";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";
import { toast } from "react-toastify";

const FindSlides = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [inputText, setInputText] = useState("");
  const [studyGuides, setStudyGuides] = useState([]);
  const [searching, setSearching] = useState(false);

  // State to determine if useAuthRedirect has finished
  const [checkingAuth, setCheckingAuth] = useState(true);
  useAuthRedirect(() => {
    setCheckingAuth(false);
  });

  // Update local input state on every keystroke
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Trigger the search and update studyGuides state
  const handleSearch = async () => {
    try {
      setSearching(true);

      if (!inputText.trim()) {
        toast.error("Please enter a keyword to search for.");
        setSearching(false);
        return;
      }

      // Extract keywords
      const keywords = keywordExtractor.extract(inputText, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      setHasSearched(true);

      // Get all study guides
      const filteredGuides = await getPublicStudyGuides(keywords);

      setStudyGuides(filteredGuides);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching.");
    } finally {
      setSearching(false);
    }
  };

  // If user presses 'Enter', run the same search function
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Head>
        <title>SlideSmart - Find Public Slides</title>
        <meta
          name="description"
          content="Search for public study guides on SlideSmart."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/find-slides" />
      </Head>
      {!checkingAuth && (
        <>
          <PageContainer>
            <Section>
              <LeftSection>
                <PageTitle>FIND STUDY GUIDES</PageTitle>
                <Subtitle>
                  Seach and Find<br></br>{" "}
                  <SubtitleSpan>Public Study Guides</SubtitleSpan>
                </Subtitle>
                <Subtext>
                  With the Spark Plan, you can find and save study guides from
                  other users as your own!
                </Subtext>
                <Subtext>Enter a keyword below to start your search.</Subtext>
                <SearchContainer>
                  <Input
                    placeholder="What are you looking for?"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <Button onClick={handleSearch}>Search</Button>
                </SearchContainer>
              </LeftSection>
              <RightSection>
                {hasSearched && !searching && (
                  <StudyGuideList guides={studyGuides} />
                )}
              </RightSection>
            </Section>
          </PageContainer>
          <Footer />
        </>
      )}
    </>
  );
};

export default FindSlides;

const Section = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  align-items: flex-start;
  text-align: center;
  padding: 32px;
`;

const LeftSection = styled.div`
  display: flex;
  width: 40%;
  @media (max-width: 768px) {
    width: 100%;
  }
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 16px;
  padding: 48px;
`;

const RightSection = styled.div`
  display: flex;
  width: 60%;
  @media (max-width: 768px) {
    width: 100%;
  }
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
`;

const PageTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const Subtitle = styled.p`
  font-size: ${fontSize.xlheading};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.black};
`;

const SubtitleSpan = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
`;

const Subtext = styled.p`
  font-size: ${fontSize.default};
  color: ${({ theme }) => theme.gray};
  line-height: 1.3;
`;

const SearchContainer = styled.div`
  margin-top: 64px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.gray};
  border-radius: 5px;
  font-size: ${fontSize.secondary};
  color: green;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.primary70};
    outline: none;
  }
`;
