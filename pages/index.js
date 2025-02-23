import styled from "styled-components";
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
import { colors } from "@/constants/colors";
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";

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
              <span style={{ color: colors.primary, fontWeight: "bold" }}>
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
              textColor={colors.primary}
              hoverTextColor={colors.white}
              backgroundColor="transparent"
              hoverBackgroundColor={colors.primary}
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
    ${colors.primary70},
    ${colors.primary33}
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
  color: ${colors.black};
  font-weight: bold;
  line-height: 1.3;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubSlogan = styled.p`
  font-size: ${fontSize.default};
  color: ${colors.black};
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
  color: ${colors.black};
`;

const MoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
`;
