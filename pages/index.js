import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import "react-circular-progressbar/dist/styles.css";
import { fontSize } from "@/constants/fontSize";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useStateContext();

  const handleMainButtonClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <>
      <PageContainer>
        <Navbar />
        <Section>
          <SloganContainer>
            <Slogan>
              The AI Application Made
              <br />
              to Make
              <span style={{ color: "#F03A47", fontWeight: "bold" }}>
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
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </Button>
          </SloganContainer>
          <InstructionContainer>
            <InstructionArea>
              <InstructionLabel>How to Begin</InstructionLabel>
              <InstructionTitle>
                Register/Login to Access Your Dashboard
              </InstructionTitle>
              <InstructionSubtitle>
                On your dashboard, click the "Create New" button and upload a
                PPTX or PDF file to create a study guide.
              </InstructionSubtitle>
            </InstructionArea>
            <InstructionArea>
              <InstructionLabel>The Study Guide</InstructionLabel>
              <InstructionTitle>Navigate Your Study Guide</InstructionTitle>
              <InstructionSubtitle>
                Browse topics, learn from highly-rated videos, access real
                world-examples, and practice questions!
              </InstructionSubtitle>
            </InstructionArea>
            <InstructionArea>
              <InstructionLabel>Features</InstructionLabel>
              <InstructionTitle>Features to Help You Excel</InstructionTitle>
              <InstructionSubtitle>
                Fully customize your study guide, share it with friends, and
                answer any questions with the help of our GPT-powered tutor,
                Sola.
              </InstructionSubtitle>
            </InstructionArea>
          </InstructionContainer>
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Section = styled.div`
  width: 100%;
  flex-grow: 1;
  background: linear-gradient(to bottom, #ff6c7633, #fff0f0cc, #ff6c7633);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
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
  color: #000000;
  font-weight: bold;
  line-height: 1.3;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubSlogan = styled.p`
  font-size: ${fontSize.default};
  color: #000000;
  line-height: 1.3;
`;

const InstructionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 32px;
  margin-top: 100px;
`;

const InstructionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 30%;
`;

const InstructionLabel = styled.div`
  font-size: ${fontSize.label};
  font-weight: bold;
  color: #000000;
  background-color: #f6f4f3;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #000000;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const InstructionTitle = styled.p`
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: #000000;
`;

const InstructionSubtitle = styled.p`
  font-size: ${fontSize.default};
  color: #000000;
`;
