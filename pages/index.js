import styled, { useTheme } from "styled-components";
import Footer from "../components/page/Footer";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import "react-circular-progressbar/dist/styles.css";
import { fontSize } from "@/constants/fontSize";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useStateContext();
  const theme = useTheme();

  const handleMainButtonClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <>
      <Head>
        <title>SlideSmart - The AI Application to Make Slides Make Sense</title>
        <meta
          name="description"
          content="We turn your course slides into comprehensive + interactive study guides equipped with plenty of useful resources to help you succeed in the classroom."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/" />
      </Head>
      <PageContainer>
        <Section>
          <SloganContainer>
            <Slogan>
              The AI Application to
              <br />
              Make
              <span style={{ color: theme.primary, fontWeight: "bold" }}>
                {" "}
                Slides
              </span>{" "}
              Make Sense
            </Slogan>
            <SubSlogan>
              We turn your course slides into comprehensive + interactive study
              guides <br></br>equipped with plenty of useful resources to help
              you succeed in the classroom.
            </SubSlogan>
            <Button
              onClick={handleMainButtonClick}
              padding="16px"
              bold
              fontSize={fontSize.subheading}
              marginTop="10px"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}{" "}
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </SloganContainer>
          {!isLoggedIn ? (
            <InstructionContainer>
              <Instruction>1. Register/Login</Instruction>
              <Instruction>2. Navigate to Your Dashboard</Instruction>
              <Instruction>3. Upload Your Course Slides/Notes </Instruction>
              <Instruction>4. Watch the Magic Happen!</Instruction>
            </InstructionContainer>
          ) : (
            <InstructionContainer>
              <Instruction>1. Navigate to Your Dashboard</Instruction>
              <Instruction>2. Upload Your Course Slides/Notes </Instruction>
              <Instruction>3. Watch the Magic Happen!</Instruction>
            </InstructionContainer>
          )}
          <MoreContainer>
            <Button
              textColor={theme.primary}
              hoverTextColor={theme.white}
              backgroundColor="transparent"
              hoverBackgroundColor={theme.primary}
              onClick={() => router.push("/how-it-works")}
            >
              Still confused? Learn more about how SlideSmart works!
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginLeft: "10px" }}
              />
            </Button>
          </MoreContainer>
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
}

const Section = styled.div`
  width: 100%;
  flex-grow: 1;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.primary70},
    ${({ theme }) => theme.primary33}
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  gap: 100px;
  overflow-x: scroll;
`;

const SloganContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  gap: 20px;
`;

const Slogan = styled.p`
  font-size: ${fontSize.xlheading};
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  line-height: 1.3;
  text-shadow: 2px 2px 4px ${({ theme }) => theme.shadow};
`;

const SubSlogan = styled.p`
  font-size: ${fontSize.default};
  color: ${({ theme }) => theme.black};
  line-height: 1.3;
`;

const InstructionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const Instruction = styled.p`
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const MoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
`;
