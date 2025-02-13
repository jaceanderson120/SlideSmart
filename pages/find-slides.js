import React, { useState } from "react";
import styled from "styled-components";
import Button from "@/components/Button";
import { fontSize } from "@/constants/fontSize";
import { getPublicStudyGuides } from "@/firebase/database";
import StudyGuideList from "@/components/StudyGuideList";
import Footer from "@/components/Footer";
import { colors } from "@/constants/colors";
import keywordExtractor from "keyword-extractor";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Head from "next/head";
import PageContainer from "@/components/PageContainer";
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

  const levenshteinDistance = (str1, str2) => {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1)
      .fill()
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1,
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1
          );
        }
      }
    }
    return dp[m][n];
  };

  const calculateSimilarity = (str1, str2) => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    const distance = levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  };

  // Trigger the search and update studyGuides state
  const handleSearch = async () => {
    let similarityThreshold = 0.75;
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
      const guides = await getPublicStudyGuides();

      // Score each guide based on keyword matches
      const scoredGuides = guides.map((guide) => {
        let relevanceScore = 0;
        const guideText = (
          guide.fileName +
          " " +
          guide.topics.join(" ")
        ).toLowerCase();

        keywords.forEach((keyword) => {
          // Check for exact matches
          if (guideText.includes(keyword.toLowerCase())) {
            relevanceScore += 2;
          } else {
            // Check each word in the guide text for fuzzy matches
            const words = guideText.split(/\s+/);
            words.forEach((word) => {
              const similarity = calculateSimilarity(
                keyword.toLowerCase(),
                word
              );
              if (similarity >= similarityThreshold) {
                relevanceScore += 1;
              }
            });
          }
        });

        return {
          ...guide,
          relevanceScore,
        };
      });

      // Filter and sort results
      const filteredGuides = scoredGuides
        .filter((guide) => guide.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

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
                <PageTitle>FIND SLIDES</PageTitle>
                <Subtitle>
                  Browse any and all<br></br>{" "}
                  <SubtitleSpan>public study guides</SubtitleSpan>
                </Subtitle>
                <Subtext>
                  Guess what? With the Spark Plan, you can save any public study
                  guides as your own!
                </Subtext>
                <Subtext>
                  Enter a keyword below and we will do the rest for you.
                </Subtext>
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
`;

const Subtitle = styled.p`
  font-size: ${fontSize.xlheading};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubtitleSpan = styled.span`
  color: ${colors.primary};
  font-weight: bold;
`;

const Subtext = styled.p`
  font-size: ${fontSize.default};
  color: ${colors.gray};
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
  border: 1px solid ${colors.gray};
  border-radius: 5px;
  font-size: ${fontSize.secondary};
  color: green;
  width: 100%;

  &:focus {
    border-color: ${colors.primary70};
    outline: none;
  }
`;
