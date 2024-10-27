import styled from 'styled-components';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';


const NewPage = () => {

    const {isLoggedIn} = useStateContext();
  
    const router = useRouter();

    const handleClick = () => {

        router.push('/login')

    };
  
  
  return (
    <>
    <Navbar />
    <Section>
      <GradientSection>
        <GradientSectionSlogan>
            The AI Application Made
            <SloganBreakLine />
            to Make
            <span style={{ color: "#F03A47", fontWeight: "bold" }}> Slides</span>{" "}
            Make Sense
        </GradientSectionSlogan>
        <p style={{ fontSize: "18px", marginTop: "20px", fontWeight: "500"}}>
          A software tool that creates comprehensive/interactive Study Guides
          equipped{" "}
        </p>
        <MakeBetterButton onClick = {handleClick}>
            {isLoggedIn ? "Make it Better": "Get Started"}
        </MakeBetterButton>
      </GradientSection>
      <HowItWorksSection>
        <HowItWorksSlogan>
          it's simple
        </HowItWorksSlogan>
        <p style={{ fontSize: "18px", marginTop: "10px", fontWeight: "500"}}>
          How to enhance your slides in less than 5 minutes
        </p>
        <HowItWorksBoxSection>
          <HowItWorksBoxDivider>
          <HowItWorksBox>  
          </HowItWorksBox>
          <p style={{ fontSize: "25px", marginTop: "10px", fontWeight: "bold"}}>
          Login or Register an Account
          </p>
          </HowItWorksBoxDivider>
          <HowItWorksBoxDivider>
          <HowItWorksBox>  
          </HowItWorksBox>
          <p style={{ fontSize: "25px", marginTop: "10px", fontWeight: "bold"}}>
          Upload your Slides
          </p>
          </HowItWorksBoxDivider>
          <HowItWorksBoxDivider>
          <HowItWorksBox>  
          </HowItWorksBox>
          <p style={{ fontSize: "25px", marginTop: "20px", fontWeight: "bold"}}>
          Watch the Magic Happen!
          </p>
          </HowItWorksBoxDivider>
        </HowItWorksBoxSection>
      </HowItWorksSection>
    <Footer />
    </Section>
    </>
  );
}; 

const Section = styled.div`
  height: 2000px;
  display: flex;
  flex-direction: column;
`

const GradientSection = styled.div`
  height: 1024px;
  background: linear-gradient(to bottom, #FF6C7633, #FFF0F0CC, #FF6C7633);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  font-size: 2rem;
`

const HowItWorksSection = styled.div`
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
  font-size: 2rem;
  background-color: #f6f4f3;
`

const HowItWorksSlogan = styled.h1`
  font-size: 60px;
  color: #000000;
  font-weight: bold;
  margin-top: 70px;
`

const HowItWorksBoxSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 450px;
  margin-top: 40px;
  
`

const HowItWorksBox = styled.div`
  width: 360px;
  height: 256px;
  background-color: #F5F9FF;
  border: 1px dashed #000000;
  border-radius: 20px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
`

const HowItWorksBoxDivider = styled.div`
  display: flex;
  margin-left: 50px;
  margin-right: 50px;
  align-items: flex-start;
  flex-direction: column;
`


const GradientSectionSlogan = styled.h1`
  font-size: 60px;
  color: #000000;
  font-weight: bold;
  margin-top: 100px;
`;

const SloganBreakLine = styled.div`
    margin: 10px;
`

const MakeBetterButton = styled.button`
  padding: 25px 30px;
  font-size: 35px;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s;
  margin-top: 40px;

  &:hover {
    color: black;
  }
`;

export default NewPage;