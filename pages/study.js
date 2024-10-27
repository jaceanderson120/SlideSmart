import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styled from "styled-components";
import { gptData } from "@/library/references";
import { googleSearchExample } from "@/library/references";
import Image from "next/image";
import youtube from "@/images/youtube.png";
import pencil from "@/images/pencil.png";
import question from "@/images/question.png";
import check from "@/images/check.png";
import Link from "next/link";

const Study = () => {
  const router = useRouter();
  const { extractedData, googleSearchResults } = router.query;

  const data = extractedData ? JSON.parse(extractedData) : gptData;
  const googleSearch = googleSearchResults
    ? JSON.parse(googleSearchResults)
    : googleSearchExample;
  const [activeTopic, setActiveTopic] = useState(null);
  const [collapsedTopics, setCollapsedTopics] = useState({});
  const [collapsedAnswers, setCollapsedAnswers] = useState({});
  const [topicContainerCollapsed, setTopicContainerCollapsed] = useState(false);

  const topicRefs = useRef({});

  const toggleTopicContainerCollapse = () => {
    setTopicContainerCollapsed(!topicContainerCollapsed);
  };

  // Function to toggle if a container is collapsed or not
  const toggleCollapse = (topic) => {
    setCollapsedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  // Function to toggle if a practice problem answer is collapsed or not
  const toggleAnswer = (answer) => {
    setCollapsedAnswers((prev) => ({
      ...prev,
      [answer]: !prev[answer],
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTopic(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    Object.keys(topicRefs.current).forEach((key) => {
      if (topicRefs.current[key]) {
        observer.observe(topicRefs.current[key]);
      }
    });

    return () => {
      Object.keys(topicRefs.current).forEach((key) => {
        if (topicRefs.current[key]) {
          observer.unobserve(topicRefs.current[key]);
        }
      });
    };
  }, [data]);

  return (
    <>
      <Navbar />
      <Section>
        <TopicContainer>
          <TopicTitle onClick={toggleTopicContainerCollapse}>
            Topics {topicContainerCollapsed ? "▼" : "▲"}
          </TopicTitle>
          {!topicContainerCollapsed && (
            <TopicScrollableContainer>
              {data &&
                Object.keys(data).map((key) => (
                  <TopicName
                    href={`#${key}`}
                    key={key}
                    className={activeTopic === key ? "active" : ""}
                  >
                    {key}
                  </TopicName>
                ))}
            </TopicScrollableContainer>
          )}
        </TopicContainer>
        <InfoContainer>
          {data &&
            Object.keys(data).map((key) => (
              <InfoSubContainer
                key={key}
                id={key}
                ref={(el) => (topicRefs.current[key] = el)}
              >
                <TopicHeaderContainer
                  id={key}
                  onClick={() => toggleCollapse(key)}
                >
                  <TopicHeaderTitle>{key}</TopicHeaderTitle>
                  <span>{collapsedTopics[key] ? "▼" : "▲"}</span>
                </TopicHeaderContainer>
                {!collapsedTopics[key] && (
                  <>
                    <TopicSummary>
                      <ImageAndTitle>
                        <Image
                          src={pencil}
                          alt="Pencil Logo"
                          width={64}
                          height={64}
                        />
                        <strong style={{ fontWeight: "bold" }}>
                          Explanation:
                        </strong>
                      </ImageAndTitle>
                      {data[key]["summary"]}
                    </TopicSummary>
                    <TopicVideo>
                      <ImageAndTitle>
                        <Image
                          src={youtube}
                          alt="YouTube Logo"
                          width={64}
                          height={64}
                        />
                        <strong style={{ fontWeight: "bold" }}>Video:</strong>
                      </ImageAndTitle>
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${data[key]["youtubeId"]}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </TopicVideo>
                    <TopicQuestion>
                      <ImageAndTitle>
                        <Image
                          src={question}
                          alt="Question Logo"
                          width={64}
                          height={64}
                        />
                        <strong style={{ fontWeight: "bold" }}>
                          Practice Problem:
                        </strong>
                      </ImageAndTitle>
                      {data[key]["question"]}
                    </TopicQuestion>
                    <TopicAnswer id={key} onClick={() => toggleAnswer(key)}>
                      <TopicAnswerContainer>
                        <ImageAndTitle>
                          <Image
                            src={check}
                            alt="Check Mark Logo"
                            width={64}
                            height={64}
                          />
                          <strong style={{ fontWeight: "bold" }}>
                            Answer:
                          </strong>
                        </ImageAndTitle>
                        <span>{!collapsedAnswers[key] ? "SHOW" : "HIDE"}</span>
                      </TopicAnswerContainer>
                      {collapsedAnswers[key] && data[key]["answer"]}
                    </TopicAnswer>
                  </>
                )}
              </InfoSubContainer>
            ))}
          <InfoSubContainer>
            <TopicHeaderContainer>
              <TopicHeaderTitle>Extra Resources</TopicHeaderTitle>
            </TopicHeaderContainer>
            <>
              <TopicSummary>
                {googleSearch.map((search) => {
                  return (
                    <>
                      <Link href={search.link} target="_blank">
                        {search.title}
                      </Link>
                    </>
                  );
                })}
              </TopicSummary>
            </>
          </InfoSubContainer>
        </InfoContainer>
      </Section>
      <Footer />
    </>
  );
};

export default Study;

// Styles
const Section = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 32px;
  text-align: center;
  height: 90vh;
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
  gap: 32px;
`;

const TopicContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 80vh;
  background-color: #f03a4733;
  border-radius: 10px;
  position: relative;
  justify-content: flex-start;
  overflow: hidden;
  border: 2px solid #f03a47;
`;

const TopicTitle = styled.div`
  border-bottom: 2px solid #f03a47;
  color: #f03a47;
  padding-bottom: 16px;
  font-size: 40px;
  font-weight: bold;
  margin: 32px;
`;

const TopicScrollableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(100% - 56px);
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 2.5;
  height: 80vh;
  position: relative;
  gap: 32px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const InfoSubContainer = styled.div`
  background-color: #3a6df00f;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #7fa3ff;
  width: 100%;
`;

const TopicHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 16px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 30px;
  cursor: pointer;
`;

const TopicHeaderTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
  background-color: #7fa3ff58;
  border-radius: 10px;
  padding: 16px;
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

const ImageAndTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
`;

const TopicAnswerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopicAnswer = styled.div`
  display: flex;
  font-size: 25px;
  justify-content: space-between;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
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

  &.active {
    background-color: #f03a4770;
    font-weight: bold;
    transition: font-weight 0.3s ease, color 0.3s ease;
  }
`;
