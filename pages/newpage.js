import styled from 'styled-components';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRouter } from 'next/router';


const NewPage = () => {
  
    const router = useRouter();

    const handleClick = () => {

        router.push('/signup')

    };
  
  
  return (
    <>
    <Navbar />
      <GradientSection>
        <Slogan>
            The AI Application Made
            <BreakLine />
            to Make
            <span style={{ color: "#F03A47", fontWeight: "bold" }}> Slides</span>{" "}
            Make Sense
        </Slogan>
        <p style={{ fontSize: "18px", marginTop: "20px"}}>
          A software tool that creates comprehensive/interactive Study Guides
          equipped{" "}
        </p>
        <MakeBetterButton onClick = {handleClick}>
            Make it Better
        </MakeBetterButton>
      </GradientSection>
    <Footer />
    </>
  );
}; 

const Section = styled.div`
  height: 2000px;
`

const GradientSection = styled.div`
  height: 1024px;
  margin-top: 8px;
  background: linear-gradient(to bottom, #FF6C7633, #FFF0F0CC, #FF6C7633);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  font-size: 2rem;
`

const Slogan = styled.h1`
  font-size: 60px;
  color: #000000;
  font-weight: bold;
  margin-top: 100px;
`;

const BreakLine = styled.div`
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