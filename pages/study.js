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
      <MainContent>
        {data &&
          Object.keys(data).map((key) => (
            <TopicContainer key={key}>
              <h2>{key}</h2>
              <p>
                <strong>Summary:</strong> {data[key]["summary"]}
              </p>
              <p>
                <strong>Question:</strong> {data[key]["question"]}
              </p>
              <p>
                <strong>Answer:</strong> {data[key]["answer"]}
              </p>
            </TopicContainer>
          ))}
      </MainContent>
      <Footer />
    </>
  );
};

export default Study;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5vw;
  background-color: #f6f4f3;
  color: #000;
`;

const TopicContainer = styled.div`
  margin-bottom: 2rem;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
`;
