import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { toast } from "react-toastify";
import { fontSize } from "@/constants/fontSize";
import Button from "@/components/Button";
import CreateModal from "@/components/CreateModal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const { isLoggedIn, currentUser, hasSpark } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleClick = () => {
    if (isLoggedIn) {
      setIsModalOpen(true);
    } else {
      router.push("/login");
    }
  };

  // Function to handle the file selection/upload
  const handleUploadSubmit = async (file, isPublic) => {
    setIsLoading(true);
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingPercentage((prev) => {
        const newPercentage = prev + getRandomInRange(3, 5);
        return newPercentage > 100 ? 100 : newPercentage;
      });
    }, 1000);
    const fileExtension = file.name.split(".").pop();
    if (fileExtension !== "pdf" && fileExtension !== "pptx") {
      clearInterval(interval);
      setIsLoading(false);
      toast.error("Invalid file type. Please upload a PDF or PPTX file.");
      // Reset the file input element
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    } else if (!hasSpark) {
      clearInterval(interval);
      setIsLoading(false);
      toast.error(
        `You need to have a Spark subscription to use this feature. To upgrade, navigate to your account icon and select "Upgrade".`
      );
      return;
    }
    const studyGuideId = await handleFileUpload(file, isPublic, currentUser);
    clearInterval(interval);
    setIsLoading(false);
    // fileUpload response is either an object with studyGuideId and an error
    if (studyGuideId !== null) {
      router.push(`/study/${studyGuideId}`);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Overlay>
          <ProgressWrapper>
            <CircularProgressbar value={loadingPercentage} />
          </ProgressWrapper>
        </Overlay>
      ) : (
        <></>
      )}
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
          onClick={handleClick}
          marginTop="40px"
          padding="16px"
          bold
          fontSize={fontSize.subheading}
        >
          {isLoggedIn ? "Upload Course Slides or Notes" : "Get Started"}
        </Button>
        {/* Hidden file input */}
        <CreateModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onUpload={handleUploadSubmit}
        ></CreateModal>
      </GradientSection>
      <Section>
        <HowItWorksSection>
          <HowItWorksSlogan>It's simple</HowItWorksSlogan>
          <p
            style={{
              fontSize: "18px",
              marginTop: "10px",
              fontWeight: "500",
            }}
          >
            How to enhance your slides in less than 1 minute
          </p>
          <HowItWorksBoxSection>
            <HowItWorksBoxDivider>
              <HowItWorksBox>
                <LoginIcon>Login</LoginIcon>
                <RegisterIcon>Register</RegisterIcon>
              </HowItWorksBox>
              <Caption>Login or Register an Account</Caption>
              <Captionv2>
                Click Login or Register in the top right of the page and enter
                your account details
              </Captionv2>
            </HowItWorksBoxDivider>
            <HowItWorksBoxDivider>
              <HowItWorksBox>
                <img
                  src="https://i.imgur.com/9tCP71d.png"
                  alt="Upload File"
                  style={{ width: "100%", height: "auto" }}
                ></img>
              </HowItWorksBox>
              <Caption>Upload Your Slides</Caption>
              <Captionv2>
                Upload your .ppt or .pdf file by using the Upload File button
              </Captionv2>
            </HowItWorksBoxDivider>
            <HowItWorksBoxDivider>
              <HowItWorksBox>
                <img
                  src="https://i.imgur.com/6l1zlVv.png"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                ></img>
              </HowItWorksBox>
              <Caption>Watch the Magic Happen!</Caption>
              <Captionv2>
                We generate a Study Guide for you divided by topic best suited
                to help you succeed
              </Captionv2>
            </HowItWorksBoxDivider>
          </HowItWorksBoxSection>
        </HowItWorksSection>
      </Section>
      <Footer />
    </>
  );
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10vw;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
`;

const RegisterIcon = styled.div`
  color: white;
  transition: color 0.3s;
  font-size: ${fontSize.default};
  font-weight: bold;
  border-radius: 8px;
  background-color: #f03a47;
  padding: 6px;
  border: 2px solid #f03a47;
  padding: 8px;
`;

const LoginIcon = styled.div`
  font-size: ${fontSize.default};
  font-weight: bold;
  margin-right: 20px;
`;
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

const HowItWorksSection = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: #f6f4f3;
`;

const HowItWorksSlogan = styled.h1`
  font-size: ${fontSize.heading};
  color: #000000;
  font-weight: bold;
`;

const HowItWorksBoxSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 48px;
`;

const HowItWorksBox = styled.div`
  width: 360px;
  height: 256px;
  background-color: #f5f9ff;
  border: 1px dashed #000000;
  border-radius: 20px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
  justify-content: center;
`;

const HowItWorksBoxDivider = styled.div`
  display: flex;
  margin-left: 50px;
  margin-right: 50px;
  align-items: flex-start;
  flex-direction: column;
`;

const Caption = styled.p`
  font-size: ${fontSize.default};
  margin-top: 16px;
  font-weight: bold;
  text-align: left;
`;

const Captionv2 = styled.p`
  font-size: ${fontSize.secondary};
  text-align: left;
  margin-top: 10px;
`;

const GradientSectionSlogan = styled.p`
  font-size: ${fontSize.heading};
  color: #000000;
  font-weight: bold;
  margin-top: 100px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ProgressWrapper = styled.div`
  width: 100px;
  height: 100px;
`;
