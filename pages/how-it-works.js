import InfoCircle from "@/components/InfoCircle";
import Navbar from "@/components/Navbar";
import PictureFrame from "@/components/PictureFrame";
import styled from "styled-components";
import dashboard from "@/images/dashboard.png";
import studyGuide from "@/images/studyGuide.png";
import sola from "@/images/sola.png";
import editMode from "@/images/editMode.png";
import register from "@/images/register.png";
import share from "@/images/share.png";
import DecorationCircle from "@/components/DecorationCircle";

const HowItWorks = () => {
  return (
    <PageContainer>
      <Navbar />
      <DecorationCircle diameter={40} left="-5%" top="5%" />
      <DecorationCircle diameter={50} right="-5%" top="80%" />
      <DecorationCircle diameter={50} left="-5%" top="160%" />
      <DecorationCircle diameter={55} left="35%" top="230%" />
      <DecorationCircle diameter={40} left="-5%" top="320%" />
      <DecorationCircle diameter={40} right="-5%" top="485%" />
      <StepContainer>
        <LeftPictureContainer>
          <PictureFrame src={register} alt="Register or Login" align="left" />
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
        <LeftCircleContainer>
          <InfoCircle
            title="Access Your Dashboard and Create a Study Guide"
            subtitle={`On your dashboard, click the "Create New" button and upload a PPTX or PDF file to create a study guide. All your study guides will be saved here!`}
            align="start"
          />
        </LeftCircleContainer>
        <RightPictureContainer>
          <PictureFrame src={dashboard} alt="Dashboard" align="right" />
        </RightPictureContainer>
      </StepContainer>
      <StepContainer>
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
        <LeftCircleContainer>
          <InfoCircle
            title="Edit Your Study Guide"
            subtitle="Fully customize your study guide with Edit Mode - Reorder/create/remove topics, edit any section, regenerate videos, and more!"
            align="start"
          />
        </LeftCircleContainer>
        <RightPictureContainer>
          <PictureFrame src={editMode} alt="Edit Mode" align="right" />
        </RightPictureContainer>
      </StepContainer>
      <StepContainer>
        <LeftPictureContainer>
          <PictureFrame src={sola} alt="Sola" align="left" />
        </LeftPictureContainer>
        <RightCircleContainer>
          <InfoCircle
            title="Chat with Sola, our GPT-4o AI Assistant"
            subtitle="Click the chat icon on the top right of your study guide to ask Sola any questions you have!"
            align="end"
          />
        </RightCircleContainer>
      </StepContainer>
      <StepContainer>
        <LeftCircleContainer>
          <InfoCircle
            title="Share Your Study Guide with Friends"
            subtitle="Click the share button in the upper right corner, enter your friend's email, and they will be able to access your study guide from their dashboard!"
            align="start"
          />
        </LeftCircleContainer>
        <RightPictureContainer>
          <PictureFrame src={share} alt="Share" align="right" />
        </RightPictureContainer>
      </StepContainer>
    </PageContainer>
  );
};

export default HowItWorks;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  position: relative;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
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
