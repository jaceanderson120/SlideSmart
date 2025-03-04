import Footer from "@/components/page/Footer";
import PageContainer from "@/components/page/PageContainer";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import PageTitle from "@/components/page/PageTitle";

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
    "Highly-Rated YouTube Videos",
    "Auto-Generation Tools",
    "Tailored Chatbot",
    "Collaborate with Friends",
    "View Other User Content",
    "Divided by Important Topics",
    "View the Original File",
  ];

  // Criteria data for each competitor, ordered by the criteria above
  const criteriaData = {
    Quizlet: [false, true, false, false, true, false, false],
    ChatGPT: [false, false, false, false, false, true, false],
    Chegg: [false, false, false, true, true, false, true],
    "AI Tutor": [false, false, true, false, false, true, false],
    NoteGPT: [false, true, true, false, false, false, true],
    Studocu: [false, false, false, false, true, true, false],
    Knowt: [false, true, true, false, true, false, true],
    SlideSpeak: [false, false, true, false, false, false, true],
  };

  const competitorInfo = information[competitor];
  const competitorData = criteriaData[competitor];

  return (
    <body>
      <main>
        <PageContainer>
          <Section>
            <TitleContainer>
              <PageTitle>SlideSmart vs. {competitor}</PageTitle>
              <Subtitle>{competitorInfo?.comparativeStatement}</Subtitle>
              <Subtext>{competitorInfo?.competitiveSlogan}</Subtext>
              <Subtext>{competitorInfo?.slidesmartSlogan}</Subtext>
            </TitleContainer>
            <ComparisonTable>
              <thead>
                <tr>
                  <TableCompareHeader>Compare Features</TableCompareHeader>
                  <TableHeader>SlideSmart</TableHeader>
                  <TableHeader>{competitor}</TableHeader>
                </tr>
              </thead>
              <tbody>
                {compareCriteria.map((criteria, index) => (
                  <tr key={index}>
                    <CriteriaTd>{criteria}</CriteriaTd>
                    <CheckmarkTd>✔️</CheckmarkTd>
                    {competitorData &&
                      (competitorData[index] ? (
                        <CheckmarkTd>✔️</CheckmarkTd>
                      ) : (
                        <XTd>❌</XTd>
                      ))}
                  </tr>
                ))}
              </tbody>
            </ComparisonTable>
          </Section>
        </PageContainer>
        <Footer />
      </main>
    </body>
  );
};

export default Competitor;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 50%;
  text-align: center;
`;

const Subtitle = styled.h1`
  font-size: ${fontSize.xlheading};
  font-weight: bold;
  text-shadow: 2px 2px 4px ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.black};
`;

const Subtext = styled.h2`
  font-size: ${fontSize.default};
  color: ${({ theme }) => theme.gray};
  line-height: 1.3;
`;

const ComparisonTable = styled.table`
  width: 60%;
  border-spacing: 0;
  border: 1px solid ${({ theme }) => theme.gray}; // Outer border of the table
  border-radius: 16px; // Outer border curve of the table
  box-shadow: 0 0 10px ${({ theme }) => theme.shadow};
  overflow: hidden;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.gray};
    padding: 32px;
  }

  // The bottom borders of table cells will be used as the borders between rows
  tr + tr th,
  tr + tr td {
    border-top: 0;
  }

  // The right borders of table cells will be used as the borders between columns
  th + th,
  th + td,
  td + th,
  td + td {
    border-left: 0;
  }

  // Remove the outer edge borders from the table cells, as the <table> element will have the border property set for the outside
  th:first-child,
  td:first-child {
    border-left: 0;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  tr:first-child th {
    border-top: 0;
  }

  tr:last-child th,
  tr:last-child td {
    border-bottom: 0;
  }
`;

const TableCompareHeader = styled.th`
  background-color: ${({ theme }) => theme.white};
  text-align: left;
  font-size: ${fontSize.label};
  font-weight: bold;
  color: ${({ theme }) => theme.gray};
`;

const TableHeader = styled.th`
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  font-size: ${fontSize.subheading};
  font-weight: bold;
  width: 25%;
`;

const CriteriaTd = styled.td`
  background-color: ${({ theme }) => theme.white};
  font-size: ${fontSize.label};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const CheckmarkTd = styled.td`
  text-align: center;
  background-color: #d2e8d6;
`;

const XTd = styled.td`
  text-align: center;
  background-color: #f7cece;
`;
