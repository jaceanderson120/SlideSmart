import styled from "styled-components";
import Footer from "../components/Footer";

export default function Home() {
  // javascript here
  const name = "Will";

  return (
    // return html here
    <Section>
      <div>Hi, {name}</div>

      <Footer />
    </Section>
  );
}

// define html and it's css here

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10vw;
  text-align: center;
  height: 100vh;
  background-color: #f1f1f1;
  color: red;
  font-size: 2rem;
`;
