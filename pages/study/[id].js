import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styled from "styled-components";
import Image from "next/image";
import youtube from "@/images/youtube.png";
import pencil from "@/images/pencil.png";
import question from "@/images/question.png";
import check from "@/images/check.png";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ShareModal from "@/components/ShareModal";
import {
  fetchStudyGuide,
  updateStudyGuideFileName,
  updateStudyGuideExtractedData,
  hasAccessToStudyGuide,
} from "@/firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { useStateContext } from "@/context/StateContext";
import Chatbot from "@/components/Chatbot";
import AutoResizeTextArea from "@/components/AutoResizeTextArea";

function getViewerUrl(url) {
  const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    url
  )}`;
  return viewerUrl;
}

const Study = () => {
  const router = useRouter();
  const { id } = router.query;
  const [studyGuide, setStudyGuide] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [collapsedTopics, setCollapsedTopics] = useState({});
  const [collapsedAnswers, setCollapsedAnswers] = useState({});
  const [isTopicsShown, setIsTopicsShown] = useState(true);
  const [isFileShown, setIsFileShown] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatbotShown, setIsChatbotShown] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const topicRefs = useRef({});
  const titleInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, loading } = useStateContext();

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

      // If the user is logged in, check if they have access to the study guide
      if (id && currentUser) {
        const hasAccess = await hasAccessToStudyGuide(id, currentUser.uid);
        // If the user does not have access to the study guide, redirect them to their study guides page
        if (!hasAccess) {
          router.push("/myStudyGuides");
          return;
        }

        // If the user has access to the study guide, fetch the study guide data
        const { fetchedStudyGuide, fileName } = await fetchStudyGuide(id);
        setStudyGuide(fetchedStudyGuide);
        setFileName(fileName);
      }
    };

    checkAccessAndFetchData();
  }, [id, currentUser, router, loading]);

  // Function to handle opening the share modal
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  // Function to close the share modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Close the menu when the user clicks outside of it
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Open the menu when the user clicks on the ellipsis icon
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Update the file name that is displayed at the top of the study guide
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Save the file name to Firestore when the input field is blurred
  const handleFileNameSave = async () => {
    if (studyGuide) {
      updateStudyGuideFileName(studyGuide.id, fileName);
    }
  };

  // Handle pressing Enter key to blur the title input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      titleInputRef.current.blur();
    }
  };

  // Save the extracted data to Firestore when the user changes it
  const updateExtractedData = (extractedData) => {
    if (studyGuide) {
      // Ensure that the extracted data is a string before saving it to Firestore
      const extractedData = JSON.stringify(studyGuide.extractedData);
      updateStudyGuideExtractedData(studyGuide.id, extractedData);
    }
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
  }, [studyGuide]);

  if (!studyGuide) {
    return <p>Loading...</p>;
  }

  // Split off the query string from the Firebase file URL
  const baseFileUrl = studyGuide.firebaseFileUrl.split("?")[0];

  // Get the file extension from the base URL
  const fileExtension = baseFileUrl.split(".").pop().toLowerCase();

  // Set the viewer URL to the Firebase file URL by default, but if it's a PowerPoint file, use the Google Drive viewer
  let viewerUrl = studyGuide.firebaseFileUrl;
  if (fileExtension === "pptx") {
    viewerUrl = getViewerUrl(studyGuide.firebaseFileUrl);
  }

  // Set the content to be an iframe with the viewer URL
  const content = (
    <iframe
      src={viewerUrl}
      style={{
        border: "none",
        width: "100%",
        height: "80vh",
        transform: "scale(0.95)",
        transformOrigin: "0 0",
      }}
    />
  );

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

  const updateStudyGuideObject = (topic, key, value) => {
    setStudyGuide((prev) => {
      const updatedData = {
        ...prev,
        extractedData: {
          ...prev.extractedData,
          [topic]: {
            ...prev.extractedData[topic],
            [key]: value,
          },
        },
      };
      return updatedData;
    });
  };

  return (
    <>
      <Navbar />
      <Section>
        <HeaderSection>
          <Title
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            onBlur={handleFileNameSave}
            onKeyDown={handleKeyDown}
            ref={titleInputRef}
          />
          <StyledFontAwesomeIcon
            icon={faEllipsisVertical}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          />
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
          >
            <StyledMenuItem
              onClick={() => {
                setIsTopicsShown(!isTopicsShown);
                handleClose();
              }}
            >
              {isTopicsShown ? "Hide Topics" : "Show Topics"}
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => {
                setIsFileShown(!isFileShown);
                handleClose();
              }}
            >
              {isFileShown ? "Hide File" : "Show File"}
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => {
                if (editMode) {
                  // Save the extracted data to Firestore when the user changes it
                  updateExtractedData(studyGuide.extractedData);
                }
                setEditMode(!editMode);
                handleClose();
              }}
            >
              {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </StyledMenuItem>
            {studyGuide.createdBy === currentUser?.uid && (
              <StyledMenuItem
                onClick={() => {
                  handleShareClick();
                  handleClose();
                }}
              >
                Share
              </StyledMenuItem>
            )}
          </Menu>
        </HeaderSection>
        {editMode && (
          <EditModeText>
            Edit Mode Enabled! Disable Edit Mode to save any edits!
          </EditModeText>
        )}
        <OutputSection>
          {isTopicsShown && (
            <TopicContainer>
              <TopicTitle>Topics</TopicTitle>
              <TopicScrollableContainer>
                {studyGuide.extractedData &&
                  Object.keys(studyGuide.extractedData).map((key) => (
                    <TopicName
                      href={`#${key}`}
                      key={key}
                      className={activeTopic === key ? "active" : ""}
                    >
                      {key}
                    </TopicName>
                  ))}
              </TopicScrollableContainer>
            </TopicContainer>
          )}
          <InfoContainer>
            {studyGuide.extractedData &&
              Object.keys(studyGuide.extractedData).map((key) => (
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
                        <AutoResizeTextArea
                          onChange={(text) => {
                            updateStudyGuideObject(key, "summary", text);
                          }}
                          defaultValue={
                            studyGuide.extractedData[key]["summary"]
                          }
                          editMode={editMode}
                        />
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
                          src={`https://www.youtube.com/embed/${studyGuide.extractedData[key]["youtubeId"]}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </TopicVideo>
                      <TopicExample>
                        <strong style={{ fontWeight: "bold" }}>Example:</strong>
                        <AutoResizeTextArea
                          onChange={(text) => {
                            updateStudyGuideObject(key, "example", text);
                          }}
                          defaultValue={
                            studyGuide.extractedData[key]["example"]
                          }
                          editMode={editMode}
                        />
                      </TopicExample>
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
                        <AutoResizeTextArea
                          onChange={(text) => {
                            updateStudyGuideObject(key, "question", text);
                          }}
                          defaultValue={
                            studyGuide.extractedData[key]["question"]
                          }
                          editMode={editMode}
                        />
                      </TopicQuestion>
                      <TopicAnswer id={key}>
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
                          <span onClick={() => toggleAnswer(key)}>
                            {!collapsedAnswers[key] ? "SHOW" : "HIDE"}
                          </span>
                        </TopicAnswerContainer>
                        {collapsedAnswers[key] && (
                          <AutoResizeTextArea
                            onChange={(text) => {
                              updateStudyGuideObject(key, "answer", text);
                            }}
                            defaultValue={
                              studyGuide.extractedData[key]["answer"]
                            }
                            editMode={editMode}
                          />
                        )}
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
                  {studyGuide.googleSearchResults.map((search) => {
                    return (
                      <div key={search.title}>
                        <Link href={search.link} target="_blank">
                          {search.title}
                        </Link>
                      </div>
                    );
                  })}
                </TopicSummary>
              </>
            </InfoSubContainer>
          </InfoContainer>
          {isFileShown && <FileContainer>{content}</FileContainer>}
          {/* Pass studyGuide to Chatbot component */}
          {isChatbotShown && <Chatbot studyGuide={studyGuide} />}
        </OutputSection>
      </Section>
      <Footer />
      <ShareModal
        studyGuideId={id}
        isOpen={isShareModalOpen}
        onRequestClose={closeShareModal}
      />
      <ChatbotIcon
        icon={faMessage}
        flip="horizontal"
        swapOpacity
        onClick={() => setIsChatbotShown(!isChatbotShown)}
      />
    </>
  );
};

export default Study;

// Styles
const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 24px;
  text-align: center;
  height: 100vh;
  color: #000000;
  background-color: #f6f4f3;
  font-size: 2rem;
  gap: 24px;
`;

const Title = styled.input`
  border: none;
  background-color: #f6f4f3;
  font-size: 3rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex-grow: 1;
  text-align: center;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;

const OutputSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 24px;
  width: 100%;
`;

const TopicContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex: 0.75;
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
  font-size: 2rem;
  font-weight: bold;
  margin: 32px;
`;

const TopicScrollableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
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
  width: 100%;
  position: relative;
  gap: 32px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.75;
  justify-content: center;
  align-items: center;
  overflow: auto;
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
  font-size: 2rem;
  font-weight: bold;
  background-color: #7fa3ff58;
  border-radius: 10px;
  padding: 16px;
`;

const TopicSummary = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicVideo = styled.div`
  display: flex;
  font-size: 1.5rem;
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
  font-size: 1.5rem;
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
  font-size: 1.5rem;
  justify-content: space-between;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicExample = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;

const TopicName = styled.a`
  padding: 16px;
  margin-right: 16px;
  margin-left: 16px;
  font-size: 1.5rem;
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

const ChatbotIcon = styled(FontAwesomeIcon)`
  position: fixed;
  bottom: 2%;
  right: 2%;
  color: #000000;
  cursor: pointer;
  font-size: 2.5rem;
  z-index: 1000;

  &:hover {
    color: #f03a47;
  }
`;

const EditModeText = styled.p`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #f03a47;
`;
