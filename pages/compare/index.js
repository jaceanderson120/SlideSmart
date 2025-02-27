import React from "react";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import { colors } from "@/constants/colors";
import PageContainer from "@/components/page/PageContainer";
import Head from "next/head";
import Footer from "@/components/page/Footer";
import Button from "@/components/Button";
import { useRouter } from "next/router";

const Compare = () => {
  const router = useRouter();
  const competitors = [
    "Quizlet",
    "ChatGPT",
    "AI Tutor",
    "NoteGPT",
    "Studocu",
    "Knowt",
    "SlideSpeak",
    "Chegg",
  ];

  return (
    <>
      <Head>
        <title>SlideSmart - Compare</title>
        <meta
          name="description"
          content="Compare SlideSmart with competitors to find out why we're the best platform for you!"
        />
        <link rel="canonical" href="https://www.slidesmartai.com/compare" />
      </Head>
      <PageContainer>
        <TopSection>
          <PageTitle>COMPARE</PageTitle>
          <Subtitle>
            Discover why <SubtitleSpan>SlideSmart</SubtitleSpan> beats the
            competition
          </Subtitle>
        </TopSection>
        <BottomSection>
          {competitors.map((competitor) => (
            <Competitor key={competitor}>
              <Button
                style={{ width: "100%", height: "100%" }}
                padding="16px"
                bold
                fontSize={fontSize.subheading}
                onClick={() => router.push(`/compare/${competitor}`)}
              >
                vs. {competitor}
              </Button>
            </Competitor>
          ))}
        </BottomSection>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Compare;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 32px;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 32px;

  @media (max-width: 768px) {
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// part of the bottomsection grid
const Competitor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const PageTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  color: ${colors.black};
`;

const Subtitle = styled.p`
  font-size: ${fontSize.xlheading};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: ${colors.black};
`;

const SubtitleSpan = styled.span`
  color: ${colors.primary};
  font-weight: bold;
`;
