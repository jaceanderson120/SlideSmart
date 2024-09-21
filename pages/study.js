import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styled from "styled-components";

const Study = () => {
  const router = useRouter();
  const { extractedData } = router.query;

  const data = extractedData ? JSON.parse(extractedData) : null;

  return (
    <>
      <Navbar />
      <Section>{JSON.stringify(data, null, 2)}</Section>
      <Footer />
    </>
  );
};

export default Study;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10vw;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
`;
