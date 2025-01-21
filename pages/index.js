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
  margin-top: 64px;
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
