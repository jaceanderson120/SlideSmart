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
      router.push("/login");
    }
  };

  return (
    <>
      <Navbar />
      <GradientSection>
        <GradientSectionSlogan>
          The AI Application Made
          <br />
          to Make
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>
            {" "}
            Slides
          </span>{" "}
          Make Sense
        </GradientSectionSlogan>
        <p
          style={{
            fontSize: fontSize.default,
            marginTop: "20px",
          }}
        >
          A software tool that creates comprehensive/interactive Study Guides
          equipped<br></br> with plenty of useful resources to help you succeed
          in the classroom
        </p>
        <Button
          onClick={handleMainButtonClick}
          marginTop="40px"
          padding="16px"
          bold
          fontSize={fontSize.subheading}
        >
          {isLoggedIn ? "Go to Dashboard" : "Get Started"}
        </Button>
      </GradientSection>
      <Footer />
    </>
  );
}

const GradientSection = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #ff6c7633, #fff0f0cc, #ff6c7633);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 96px;
  text-align: center;
`;

const GradientSectionSlogan = styled.p`
  font-size: ${fontSize.heading};
  color: #000000;
  font-weight: bold;
  margin-top: 100px;
`;
