import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}{" "}
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </SloganContainer>
          <InstructionContainer>
            {!isLoggedIn && (
              <>
                Register/Login <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
            Navigate to Your Dashboard <FontAwesomeIcon icon={faArrowRight} />
            Upload Your Course Slides/Notes{" "}
            <FontAwesomeIcon icon={faArrowRight} />
            Watch the Magic Happen!
          </InstructionContainer>
          <MoreContainer>
            <Button
              textColor="#f03a47"
              hoverTextColor="#ffffff"
              backgroundColor="transparent"
              hoverBackgroundColor="#f03a47"
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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  align-items: center;
  justify-content: center;
  gap: 32px;
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: #000000;
`;

const MoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
`;
