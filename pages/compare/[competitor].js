import Footer from "@/components/page/Footer";
import PageContainer from "@/components/page/PageContainer";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";

const Competitor = () => {
  const router = useRouter();
  const { competitor } = router.query;

  const information = {
    Quizlet: {
      comparativeStatement: "Flashcards alone don’t make for deep learning.",
      competitiveSlogan:
        "Quizlet is the definition of repetitive memorization without real context or engagement. At SlideSmart, we transform slides into interactive study guides with highly-rated YouTube videos, helping you truly understand the material, not just recall it.",
    },
    ChatGPT: {
      comparativeStatement:
        "ChatGPT is great for conversation, but not for learning.",
      competitiveSlogan:
        "ChatGPT is the definition of generic, text-heavy learning without interactive focus. SlideSmart’s philosophy is to turn slides into interactive study guides with highly-rated YouTube videos. We’re here to show you why that’s the smarter approach.",
    },
    Chegg: {
      comparativeStatement:
        "Copying answers isn’t the same as actually learning.",
      competitiveSlogan:
        "Chegg is the definition of quick fixes without true understanding. The key to SlideSmart is to make learning engaging and helping students truly grasp concepts instead of just memorizing answers.",
    },
    "AI Tutor": {
      comparativeStatement:
        "Long, drawn-out lessons don’t keep students engaged.",
      competitiveSlogan:
        "AI-Tutor.ai is the definition of overwhelming, time-consuming sessions that lose your focus. SlideSmart’s philosophy is to break down content into bite-sized study guides with highly-rated YouTube videos, making learning efficient and engaging.",
    },
    NoteGPT: {
      comparativeStatement:
        "Taking notes is just the first step, not the whole journey.",
      competitiveSlogan:
        "NoteGPT turns plain text into even more overwhelming plain text. With SlideSmart, we elevate your study materials by transforming slides into dynamic study guides enriched with highly-rated YouTube videos, so you don’t just review notes—you actually learn.",
    },
    Studocu: {
      comparativeStatement:
        "Summarizing a topic doesn’t make studying effective.",
      competitiveSlogan:
        "Studocu is packed with unorganized notes that lack structure and depth. SlideSmart turns slides into focused study guides, enriched with highly-rated YouTube videos, so you get clear, concise, and meaningful learning every time.",
    },
    Knowt: {
      comparativeStatement:
        "Simply generating notes isn’t the same as actively engaging with the material.",
      competitiveSlogan:
        "Knowt automates notes but leaves the real learning up to you. SlideSmart transforms passive notes into study guides enriched with top-rated YouTube videos, ensuring you don’t just take notes—you truly understand.",
    },
    SlideSpeak: {
      comparativeStatement:
        "Turning slides into text doesn’t mean turning them into effective study tools.",
      competitiveSlogan:
        "SlideSpeak extracts words, but it doesn’t enhance understanding. SlideSmart goes beyond text extraction by transforming slides into dynamic study guides with highly-rated YouTube videos, making learning clearer, deeper, and more engaging.",
    },
  };

  const compareCriteria = [
    "Highly-rated YouTube videos",
    "Auto-generation tools",
    "Chatbot tailored to slide content",
    "Collaboration with others",
    "View other study guides",
    "Divided by important topics for your understanding",
    "View your original file",
  ];

  const competitorInfo = information[competitor];

  return (
    <>
      <PageContainer>
        <Section>
          <TitleContainer>
            <PageTitle>SlideSmart vs. {competitor}</PageTitle>
            <Subtitle>{competitorInfo?.comparativeStatement}</Subtitle>
            <Subtext>{competitorInfo?.competitiveSlogan}</Subtext>
            <Subtext>{competitorInfo?.slidesmartSlogan}</Subtext>
          </TitleContainer>
        </Section>
        <Section>
          <ComparisonTable>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>SlideSmart</th>
                <th>{competitor}</th>
              </tr>
            </thead>
            <tbody>
              {compareCriteria.map((criteria, index) => (
                <tr key={index}>
                  <td>{criteria}</td>
                  <td>✔️</td>
                  <td>❌</td>
                </tr>
              ))}
            </tbody>
          </ComparisonTable>
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Competitor;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 50%;
  text-align: center;
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

const Subtext = styled.p`
  font-size: ${fontSize.default};
  color: ${colors.gray};
  line-height: 1.3;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 32px 0;

  th,
  td {
    border: 1px solid ${colors.gray};
    padding: 16px;
    text-align: center;
  }

  th {
    background-color: ${colors.primary};
    color: ${colors.white};
    font-size: ${fontSize.subheading};
  }

  td {
    font-size: ${fontSize.default};
  }
`;
