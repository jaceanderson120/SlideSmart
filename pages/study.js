import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styled from "styled-components";
import { gptData } from "@/library/references";

const Study = () => {
  const router = useRouter();
  const { extractedData } = router.query;

  const data = extractedData ? JSON.parse(extractedData) : gptData;

  return (
    <>
      <Navbar />
      <Section>
        <TopicContainer>
          <TopicTitle>Topics</TopicTitle>
        <TopicScrollableContainer>
          {data &&
            Object.keys(data).map((key) => (
              <TopicName href={`#${key}`} key={key}>
                {key}
              </TopicName>
            ))}
        </TopicScrollableContainer>
        </TopicContainer>
        <InfoContainer>
          {data &&
            Object.keys(data).map((key) => (
              <>
                <TopicHeader id={key}>{key}</TopicHeader>
                <TopicSummary>
                  <strong style={{ fontWeight: "bold" }}>Definition:</strong>
                  {data[key]["summary"]}
                </TopicSummary>
                <TopicVideo>
                  <strong style={{ fontWeight: "bold" }}>Video:</strong>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${data[key]["youtubeId"]}`}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </TopicVideo>
                <TopicQuestion>
                  <strong style={{ fontWeight: "bold" }}>Question:</strong>
                  {data[key]["question"]}
                  <strong style={{ fontWeight: "bold" }}>Answer:</strong>
                  <p style={{ marginBottom: "32px" }}>{data[key]["answer"]}</p>
                </TopicQuestion>
              </>
            ))}
        </InfoContainer>
      </Section>
      <Footer />
    </>
  );
};

export default Study;

const TopicTitle = styled.div`
  border-bottom: 2px solid black;
  padding-bottom: 16px;
  font-size: 40px;
  font-weight: bold;
  margin: 16px;
`;

const TopicName = styled.a`
  padding: 16px;
  margin-right: 16px;
  margin-left: 16px;
  font-size: 30px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s;
  border-radius: 16px;

  &:hover {
    background-color: #f03a4770;
  }
`;

const Section = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 32px;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
  gap: 32px;
`;

const TopicContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 90vh;
  background-color: #f03a4733;
  border-radius: 10px;
  position: relative;
  justify-content: center;
  
  // scrollable with hidden scroll bar
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const TopicScrollableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  justify-content: center;
  
  // scrollable with hidden scroll bar
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 2.5;
  height: 90vh;
  background-color: #3a6df00f;
  border-radius: 10px;
  padding: 16px;
  position: relative;

  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const TopicHeader = styled.p`
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: bold;
  text-decoration: underline;
`;

const TopicSummary = styled.div`
  display: flex;
  font-size: 25px;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicVideo = styled.div`
  display: flex;
  font-size: 25px;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicQuestion = styled.div`
  display: flex;
  font-size: 25px;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  border-bottom: 2px solid black;
  margin-bottom: 32px;
`;
