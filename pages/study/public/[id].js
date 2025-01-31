import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import styled from "styled-components";
import Image from "next/image";
import youtube from "@/images/youtube.png";
import textbook from "@/images/textbook.png";
import pencil from "@/images/pencil.png";
import question from "@/images/question.png";
import check from "@/images/check.png";
import Link from "next/link";
import AutoResizeTextArea from "@/components/AutoResizeTextArea";
import Button from "@/components/Button";
import {
  uploadStudyGuideToFirebase,
  fetchStudyGuide,
} from "@/firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "react-activity/dist/library.css";

function getViewerUrl(url) {
  const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    url
  )}`;
  return viewerUrl;
}

const PublicStudy = () => {
  const router = useRouter();
  const { id } = router.query;
  const [studyGuide, setStudyGuide] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isTopicsShown, setIsTopicsShown] = useState(true);
  const [fileName, setFileName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [videoIndices, setVideoIndices] = useState([]);
  const topicRefs = useRef({});
  const titleInputRef = useRef(null);
  const { currentUser, loading } = useStateContext();
  const [collapsedAnswers, setCollapsedAnswers] = useState({});

  // Hanlde user saving the study guide
  const saveStudyGuide = async () => {
    let studyGuideClone = {
      fileName: studyGuide.fileName,
      extractedData: JSON.stringify(studyGuide.extractedData),
      googleSearchResults: JSON.stringify(studyGuide.googleSearchResults),
      firebaseFileUrl: null,
      createdAt: new Date(),
      createdBy: currentUser.uid,
      contributors: [currentUser.uid],
      editors: [currentUser.uid],
      isPublic: false,
      gotFromPublic: true,
    };

    const studyGuideId = await uploadStudyGuideToFirebase(studyGuideClone);

    if (studyGuideId !== null) {
      router.push(`/study/${studyGuideId}`);
    }
  };

  // When navigating to the study guide page (on mount), clear the chatbot messages
  useEffect(() => {
    localStorage.removeItem("chatbotMessages");
  }, []);

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      // If the state context is still loading, wait for it to finish
      if (loading) {
        return;
      }

      // If the user is not logged in, redirect them to the login page
      if (!currentUser) {
        router.push("/login");
        return;
      }

      // If the user has access to the study guide, fetch the study guide data
      const { fetchedStudyGuide, fileName } = await fetchStudyGuide(id);
      console.log(fetchedStudyGuide);
      setStudyGuide(fetchedStudyGuide);
      setFileName(fileName);

      // Set the youtube indices to zeros for each topic
      const indices = {};
      Object.keys(fetchedStudyGuide.extractedData).forEach((key) => {
        indices[key] = 0;
      });
      setVideoIndices(indices);
    };

    checkAccessAndFetchData();
  }, [id, currentUser, router, loading]);

  useEffect(() => {
    // When 100% of a topic title is in view, set it as the active topic by calling the callback function
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTopic(entry.target.id);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: "0px",
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
  }, [studyGuide]);

  if (!studyGuide) {
    return <></>;
  }

  // Function to reorder the keys of studyGuide.extractedData
  const reorderExtractedData = (order) => {
    setStudyGuide((prev) => {
      const reorderedData = {};
      order.forEach((key) => {
        if (prev.extractedData[key]) {
          reorderedData[key] = prev.extractedData[key];
        }
      });
      return {
        ...prev,
        extractedData: reorderedData,
      };
    });
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(Object.keys(studyGuide.extractedData));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderExtractedData(items);
  };

  // Function to toggle if a practice problem answer is collapsed or not
  const toggleAnswer = (answer) => {
    setCollapsedAnswers((prev) => ({
      ...prev,
      [answer]: !prev[answer],
    }));
  };

  // Function to go to previous video
  const goToPreviousVideo = (topic) => {
    if (videoIndices[topic] > 0) {
      setVideoIndices((prev) => ({
        ...prev,
        [topic]: prev[topic] - 1,
      }));
    } else {
      setVideoIndices((prev) => ({
        ...prev,
        [topic]: studyGuide.extractedData[topic]["youtubeIds"].length - 1,
      }));
    }
  };

  // Function to go to next video
  const goToNextVideo = (topic) => {
    if (
      videoIndices[topic] <
      studyGuide.extractedData[topic]["youtubeIds"].length - 1
    ) {
      setVideoIndices((prev) => ({
        ...prev,
        [topic]: prev[topic] + 1,
      }));
    } else {
      setVideoIndices((prev) => ({
        ...prev,
        [topic]: 0,
      }));
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <Section>
        <HeaderSection>
          <Title readOnly type="text" value={fileName} ref={titleInputRef} />
          <MenuTriggerArea>
            <Button onClick={saveStudyGuide}>Save File</Button>
          </MenuTriggerArea>
        </HeaderSection>
        <OutputSection>
          {isTopicsShown && (
            <DragDropContext onDragEnd={editMode ? handleDragEnd : () => {}}>
              <Droppable droppableId="topics">
                {(provided) => (
                  <ContentContainer
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {Object.keys(studyGuide.extractedData).map((key, index) => (
                      <Draggable
                        key={key}
                        draggableId={key}
                        index={index}
                        isDragDisabled={!editMode}
                      >
                        {(provided) => (
                          <TopicName
                            href={`#${key}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={activeTopic === key ? "active" : ""}
                          >
                            {key}
                            {editMode && <FontAwesomeIcon icon={faGrip} />}
                          </TopicName>
                        )}
                      </Draggable>
                    ))}
                    {/* Placeholder to maintain the space that the dragged item would occupy */}
                    {provided.placeholder}
                  </ContentContainer>
                )}
              </Droppable>
            </DragDropContext>
          )}
          <InfoContainer id="infoContainer">
            {studyGuide.extractedData &&
              Object.keys(studyGuide.extractedData).map((key) => (
                <InfoSubContainer key={key} id={key}>
                  <TopicHeaderContainer
                    id={key}
                    ref={(el) => (topicRefs.current[key] = el)}
                  >
                    <TopicHeaderTitle>{key}</TopicHeaderTitle>
                  </TopicHeaderContainer>
                  {(studyGuide.extractedData[key]["summary"] ||
                    studyGuide.extractedData[key]["summary"] === "") && (
                    <TopicSubContainer>
                      <ImageAndTitleContainer>
                        <ImageAndTitle>
                          <Image
                            src={pencil}
                            alt="Pencil Logo"
                            width={48}
                            height={48}
                          />
                          <strong style={{ fontWeight: "bold" }}>
                            Summary:
                          </strong>
                        </ImageAndTitle>
                      </ImageAndTitleContainer>
                      <AutoResizeTextArea
                        key={editMode} // Trigger re-render when edit mode changes
                        onChange={(text) => {
                          updateStudyGuideObject(key, "summary", text);
                        }}
                        defaultValue={studyGuide.extractedData[key]["summary"]}
                        editMode={editMode}
                      />
                    </TopicSubContainer>
                  )}
                  {studyGuide.extractedData[key]["youtubeIds"] && (
                    <TopicSubContainer>
                      <ImageAndTitleContainer>
                        <ImageAndTitle>
                          <Image
                            src={youtube}
                            alt="YouTube Logo"
                            width={48}
                            height={48}
                          />
                          <strong style={{ fontWeight: "bold" }}>Video:</strong>
                        </ImageAndTitle>
                        <div>
                          <StyledFontAwesomeIcon
                            icon={faArrowLeft}
                            onClick={() => {
                              goToPreviousVideo(key);
                            }}
                            title="Previous Video"
                          />
                          <StyledFontAwesomeIcon
                            icon={faArrowRight}
                            onClick={() => {
                              goToNextVideo(key);
                            }}
                            title="Next Video"
                          />
                        </div>
                      </ImageAndTitleContainer>
                      {studyGuide.extractedData[key]["youtubeIds"] !==
                      "None" ? (
                        <iframe
                          width="560"
                          height="315"
                          src={`https://www.youtube.com/embed/${
                            studyGuide.extractedData[key]["youtubeIds"][
                              videoIndices[key]
                            ]
                          }`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <NoVideoText>No video available.</NoVideoText>
                      )}
                    </TopicSubContainer>
                  )}
                  {(studyGuide.extractedData[key]["example"] ||
                    studyGuide.extractedData[key]["example"] === "") && (
                    <TopicSubContainer>
                      <ImageAndTitleContainer>
                        <ImageAndTitle>
                          <Image
                            src={textbook}
                            alt="Textbook Logo"
                            width={48}
                            height={48}
                          />
                          <strong style={{ fontWeight: "bold" }}>
                            Example:
                          </strong>
                        </ImageAndTitle>
                      </ImageAndTitleContainer>
                      <AutoResizeTextArea
                        key={editMode} // Trigger re-render when edit mode changes
                        onChange={(text) => {
                          updateStudyGuideObject(key, "example", text);
                        }}
                        defaultValue={studyGuide.extractedData[key]["example"]}
                        editMode={editMode}
                      />
                    </TopicSubContainer>
                  )}
                  {(studyGuide.extractedData[key]["question"] ||
                    studyGuide.extractedData[key]["question"] === "") && (
                    <TopicSubContainer>
                      <ImageAndTitleContainer>
                        <ImageAndTitle>
                          <Image
                            src={question}
                            alt="Question Logo"
                            width={48}
                            height={48}
                          />
                          <strong style={{ fontWeight: "bold" }}>
                            Question:
                          </strong>
                        </ImageAndTitle>
                      </ImageAndTitleContainer>
                      <AutoResizeTextArea
                        key={editMode} // Trigger re-render when edit mode changes
                        onChange={(text) => {
                          updateStudyGuideObject(key, "question", text);
                        }}
                        defaultValue={studyGuide.extractedData[key]["question"]}
                        editMode={editMode}
                      />
                    </TopicSubContainer>
                  )}
                  {(studyGuide.extractedData[key]["answer"] ||
                    studyGuide.extractedData[key]["answer"] === "") && (
                    <TopicSubContainer>
                      <TopicAnswerContainer>
                        <ImageAndTitleContainer>
                          <ImageAndTitle>
                            <Image
                              src={check}
                              alt="Check Mark Logo"
                              width={48}
                              height={48}
                            />
                            <strong style={{ fontWeight: "bold" }}>
                              Answer:
                            </strong>
                          </ImageAndTitle>
                        </ImageAndTitleContainer>
                        {!editMode && (
                          <Button
                            onClick={() => toggleAnswer(key)}
                            padding="8px"
                            fontSize={fontSize.label}
                            backgroundColor="#f03a4770"
                            hoverBackgroundColor="#f03a4770"
                            textColor="#000000"
                            hoverTextColor="#ffffff"
                          >
                            {!collapsedAnswers[key] ? "SHOW" : "HIDE"}
                          </Button>
                        )}
                      </TopicAnswerContainer>
                      {!editMode ? (
                        collapsedAnswers[key] && (
                          <AutoResizeTextArea
                            key={editMode} // Trigger re-render when edit mode changes
                            onChange={(text) => {
                              updateStudyGuideObject(key, "answer", text);
                            }}
                            defaultValue={
                              studyGuide.extractedData[key]["answer"]
                            }
                            editMode={editMode}
                          />
                        )
                      ) : (
                        <AutoResizeTextArea
                          key={editMode} // Trigger re-render when edit mode changes
                          onChange={(text) => {
                            updateStudyGuideObject(key, "answer", text);
                          }}
                          defaultValue={studyGuide.extractedData[key]["answer"]}
                          editMode={editMode}
                        />
                      )}
                    </TopicSubContainer>
                  )}
                </InfoSubContainer>
              ))}
            <InfoSubContainer>
              <TopicHeaderContainer>
                <TopicHeaderTitle>Extra Resources</TopicHeaderTitle>
              </TopicHeaderContainer>
              <>
                <TopicSubContainer>
                  {studyGuide.googleSearchResults.map((search) => {
                    return (
                      <div key={search.title}>
                        <Link href={search.link} target="_blank">
                          {search.title}
                        </Link>
                      </div>
                    );
                  })}
                </TopicSubContainer>
              </>
            </InfoSubContainer>
          </InfoContainer>
        </OutputSection>
      </Section>
    </PageContainer>
  );
};

export default PublicStudy;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Section = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 24px;
  text-align: center;
  color: #000000;
  background-color: #ffffff;
  gap: 24px;
  overflow: auto;
`;

const Title = styled.input`
  font-size: ${fontSize.heading};
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 8px;
  text-align: center;
  border-radius: 10px;
  width: ${({ value }) => value.length + "ch"};
  min-width: 20%;
  max-width: 40%;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const MenuTriggerArea = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 32px;
  cursor: pointer;
  gap: 8px;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding-left: 10px; // padding to make element easier to click
  padding-right: 10px;
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
    cursor: pointer;
  }
`;

const OutputSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  overflow: auto;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.75;
  background-color: transparent;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 2.5;
  width: 100%;
  position: relative;
  gap: 32px;
  overflow: auto;
`;

const InfoSubContainer = styled.div`
  background-color: #f6f4f3;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
`;

const TopicHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  padding: 16px;
`;

const TopicHeaderTitle = styled.div`
  font-size: ${fontSize.subheading};
  font-weight: bold;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: #000000;
    margin-top: 10px;
  }
`;

const ImageAndTitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ImageAndTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const TopicAnswerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopicSubContainer = styled.div`
  display: flex;
  font-size: ${fontSize.label};
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicName = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  padding: 16px;
  margin-right: 16px;
  margin-left: 16px;
  font-size: ${fontSize.label};
  text-decoration: none;
  color: inherit;
  background-color: #f03a4733;
  transition: background-color 0.3s;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  // wrap text
  white-space: normal;
  word-wrap: break-word;

  &:hover {
    background-color: #f03a4770;
  }

  &.active {
    background-color: #f03a4770;
    font-weight: bold;
    transition: font-weight 0.3s ease, color 0.3s ease;
  }
`;

const NoVideoText = styled.p`
  font-size: ${fontSize.default};
  font-style: italic;
  color: #000000;
  padding: 8px;
`;
