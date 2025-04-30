import InfoCircle from "@/components/howItWorks/InfoCircle";
import Navbar from "@/components/page/Navbar";
import PictureFrame from "@/components/howItWorks/PictureFrame";
import styled from "styled-components";
import dashboard from "@/images/dashboard.png";
import studyGuide from "@/images/studyGuide.png";
import sola from "@/images/sola.png";
import editMode from "@/images/editMode.png";
import register from "@/images/register.png";
import share from "@/images/share.png";
import showFile from "@/images/showFile.png";
import DecorationCircle from "@/components/howItWorks/DecorationCircle";
import { useEffect, useState } from "react";
import Head from "next/head";

const HowItWorks = () => {
  const [decorCircleDiameter, setDecorCircleDiameter] = useState(50);

  // Adjust decoration circle size based on screen width
  const updateCircleDiameter = () => {
    if (window.innerWidth < 768) {
      setDecorCircleDiameter(30);
    } else {
      setDecorCircleDiameter(50);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateCircleDiameter);
    updateCircleDiameter(); // Initial call to set the diameter based on the initial window size
    return () => window.removeEventListener("resize", updateCircleDiameter);
  }, []);

  return (
    <>
      <Head>
        <title>SolaSlides - How It Works</title>
        <meta
          name="description"
          content="Learn how to create and navigate your study guides on SolaSlides!"
        />
        <link rel="canonical" href="https://www.solaslides.com/how-it-works" />
      </Head>

      <main>
        <PageContainer>
          <Navbar />
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              left="-5%"
              top="-15%"
            />
            <LeftPictureContainer>
              <PictureFrame
                src={register}
                alt="Register or Login"
                align="left"
              />
            </LeftPictureContainer>
            <RightCircleContainer>
              <InfoCircle
                title="Get Started by Registering or Logging In"
                subtitle="Click the 'Get Started' button on the home page, or use the buttons in the top right corner to register or login."
                align="end"
              />
            </RightCircleContainer>
          </StepContainer>
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              right="-5%"
              top="-15%"
            />
            <LeftCircleContainer>
              <InfoCircle
                title="Access Your Dashboard to Create a Study Guide"
                subtitle={`On your dashboard, click the "Create New" button and upload a PPTX or PDF file to create a study guide. All your study guides will be saved here!`}
                align="start"
              />
            </LeftCircleContainer>
            <RightPictureContainer>
              <PictureFrame src={dashboard} alt="Dashboard" align="right" />
            </RightPictureContainer>
          </StepContainer>
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              left="-5%"
              top="-15%"
            />
            <LeftPictureContainer>
              <PictureFrame src={studyGuide} alt="Study Guide" align="left" />
            </LeftPictureContainer>
            <RightCircleContainer>
              <InfoCircle
                title="Navigate Your Study Guide"
                subtitle="Browse topics, learn from highly-rated videos, access real world-examples, and practice questions!"
                align="end"
              />
            </RightCircleContainer>
          </StepContainer>

          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              right="-5%"
              top="-15%"
            />
            <LeftCircleContainer>
              <InfoCircle
                title="Edit Your Study Guide"
                subtitle="Fully customize your study guide with Edit Mode - Reorder/create/remove topics, change the title, edit any section, regenerate videos, and more!"
                align="start"
              />
            </LeftCircleContainer>
            <RightPictureContainer>
              <PictureFrame src={editMode} alt="Edit Mode" align="right" />
            </RightPictureContainer>
          </StepContainer>
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              left="-5%"
              top="-15%"
            />
            <LeftPictureContainer>
              <PictureFrame src={showFile} alt="Show File" align="left" />
            </LeftPictureContainer>
            <RightCircleContainer>
              <InfoCircle
                title="View Slides and Guide Side-by-Side"
                subtitle={`Click on the three dots in the upper right corner and choose "Show File" to view your slides and study guide side-by-side!`}
                align="end"
              />
            </RightCircleContainer>
          </StepContainer>
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              right="-5%"
              top="-15%"
            />
            <LeftCircleContainer>
              <InfoCircle
                title="Chat with Sola, our AI Assistant"
                subtitle="Click the chat icon on the top right of your study guide to ask Sola any questions you have! Also, if you upload an image to Sola, she can answer questions about it!"
                align="start"
              />
            </LeftCircleContainer>
            <RightPictureContainer>
              <PictureFrame src={sola} alt="Sola" align="right" />
            </RightPictureContainer>
          </StepContainer>
          <StepContainer>
            <DecorationCircle
              diameter={decorCircleDiameter}
              left="-5%"
              top="-15%"
            />
            <LeftPictureContainer>
              <PictureFrame src={share} alt="Share" align="left" />
            </LeftPictureContainer>
            <RightCircleContainer>
              <InfoCircle
                title="Share Your Study Guide with Friends"
                subtitle="Click the share button in the upper right corner, enter your friend's email, and they will be able to access your study guide from their dashboard!"
                align="end"
              />
            </RightCircleContainer>
          </StepContainer>
        </PageContainer>
      </main>
    </>
  );
};

export default HowItWorks;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-color: ${({ theme }) => theme.primary70} transparent;
  position: relative;
  background-color: ${({ theme }) => theme.lightGray};
  z-index: 0;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const LeftPictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 10%;
`;

const RightPictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10%;
`;

const LeftCircleContainer = styled.div`
  position: relative;
  left: -15%;
  padding: 32px;
`;

const RightCircleContainer = styled.div`
  position: relative;
  right: -15%;
  padding: 32px;
`;
