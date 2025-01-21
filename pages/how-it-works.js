import InfoCircle from "@/components/InfoCircle";
import Navbar from "@/components/Navbar";
import PictureFrame from "@/components/PictureFrame";
import styled from "styled-components";
import dashboard from "@/images/dashboard.png";

const HowItWorks = () => {
  return (
    <PageContainer>
      <Navbar />
      <StepContainer>
        <LeftCircleContainer>
          <InfoCircle />
        </LeftCircleContainer>
        <RightPictureContainer>
          <PictureFrame src={dashboard} alt="Dashboard" />
        </RightPictureContainer>
      </StepContainer>
      <StepContainer>
        <LeftPictureContainer>
          <PictureFrame src={dashboard} alt="Dashboard" />
        </LeftPictureContainer>
        <RightCircleContainer>
          <InfoCircle />
        </RightCircleContainer>
      </StepContainer>
      <StepContainer>
        <LeftCircleContainer>
          <InfoCircle />
        </LeftCircleContainer>
        <RightPictureContainer>
          <PictureFrame src={dashboard} alt="Dashboard" />
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
