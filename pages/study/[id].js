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
import { useStateContext } from "@/context/StateContext";
import Chatbot from "@/components/Chatbot";
import AutoResizeTextArea from "@/components/AutoResizeTextArea";
import { toast } from "react-toastify";
import { fontSize } from "@/constants/fontSize";
import CustomMenu from "@/components/CustomMenu";
import Button from "@/components/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";

function getViewerUrl(url) {
  const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    url
  )}`;
  return viewerUrl;
}

const Study = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialStudyGuide, setInitialStudyGuide] = useState(null);
  const [studyGuide, setStudyGuide] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [collapsedAnswers, setCollapsedAnswers] = useState({});
  const [isTopicsShown, setIsTopicsShown] = useState(true);
  const [isFileShown, setIsFileShown] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatbotShown, setIsChatbotShown] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [isDiscardEditsDialogOpen, setIsDiscardEditsDialogOpen] =
    useState(false);
  const topicRefs = useRef({});
  const titleInputRef = useRef(null);
  const { currentUser, loading } = useStateContext();

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

  // Update the file name that is displayed at the top of the study guide
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Save the file name to Firestore when the input field is blurred
  const handleFileNameSave = async () => {
    if (studyGuide) {
      if (fileName.length < 1) {
        setFileName("Untitled Study Guide");
        updateStudyGuideFileName(studyGuide.id, "Untitled Study Guide");
      } else {
        updateStudyGuideFileName(studyGuide.id, fileName);
      }
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

  // Function to toggle if a practice problem answer is collapsed or not
  const toggleAnswer = (answer) => {
    setCollapsedAnswers((prev) => ({
      ...prev,
      [answer]: !prev[answer],
    }));
  };

  // Function to update the study guide object with the new value
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

  // Function to handle when the user clicks the edit mode option in the menu
  const handleEditClicked = () => {
    if (editMode) {
      // Save the extracted data to Firestore when the user changes it
      updateExtractedData(studyGuide.extractedData);
      toast.info(
        "Edit Mode has been disabled. Your study guide has been saved successfully!"
      );
    } else {
      setInitialStudyGuide(studyGuide);
      toast.info(
        "Edit Mode has been enabled. Make your changes and disable Edit Mode to save!"
      );
    }
    setEditMode(!editMode);
  };

  // Function to handle discarding edits
  const discardEdits = () => {
    setStudyGuide({ ...initialStudyGuide });
    setEditMode(false);
    toast.info("Edits have been discarded!");
  };

  const handleTopicToggle = () => {
    setIsTopicsShown(!isTopicsShown);
  };

  const handleChatbotToggle = () => {
    setIsChatbotShown(!isChatbotShown);
  };

  const handleFileToggle = () => {
    setIsFileShown(!isFileShown);
  };

  // Menu items for the study guide page
  const menuItems = [
    {
      name: isTopicsShown ? "Collapse Topics" : "Show Topics",
      onClick: handleTopicToggle,
    },
    {
      name: isFileShown ? "Collapse File" : "Show File",
      onClick: handleFileToggle,
    },
    {
      name: isChatbotShown ? "Collapse Sola" : "Show Sola",
      onClick: handleChatbotToggle,
    },
  ];

  // Append the share option if needed
  if (studyGuide.createdBy === currentUser?.uid) {
    menuItems.push({ name: "Share", onClick: handleShareClick });
  }

  // Append the edit mode option if needed
  if (studyGuide.editors.includes(currentUser?.uid)) {
    menuItems.push({
      name: editMode ? "Disable Edit Mode (Save)" : "Enable Edit Mode",
      onClick: handleEditClicked,
    });
  }

  return (
    <PageContainer>
      <Navbar />
      <Section>
        <HeaderSection>
          {editMode && (
            <SaveButtonArea>
              <Button
                backgroundColor="#7fa3ff70"
                hoverBackgroundColor="#7fa3ff"
                textColor="#000000"
                hoverTextColor="#ffffff"
                onClick={handleEditClicked}
              >
                Save Edits
              </Button>
              <Button
                backgroundColor="#f03a4770"
                hoverBackgroundColor="#f03a47"
                textColor="#000000"
                hoverTextColor="#ffffff"
                onClick={() => setIsDiscardEditsDialogOpen(true)}
              >
                Discard Edits
              </Button>
            </SaveButtonArea>
          )}
          <Title
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            onBlur={handleFileNameSave}
            onKeyDown={handleKeyDown}
            ref={titleInputRef}
            readOnly={
              studyGuide.editors.includes(currentUser?.uid) ? false : true
            }
          />
          <MenuTriggerArea>
            <CustomMenu
              triggerElement={
                <StyledFontAwesomeIcon icon={faEllipsisVertical} size="2x" />
              }
              menuItems={menuItems}
            />
          </MenuTriggerArea>
        </HeaderSection>
        <OutputSection>
          {isTopicsShown && (
            <ContentContainer>
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
            </ContentContainer>
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
                  <TopicSubContainer>
                    <ImageAndTitle>
                      <Image
                        src={pencil}
                        alt="Pencil Logo"
                        width={48}
                        height={48}
                      />
                      <strong style={{ fontWeight: "bold" }}>Summary:</strong>
                    </ImageAndTitle>
                    <AutoResizeTextArea
                      key={editMode} // Trigger re-render when edit mode changes
                      onChange={(text) => {
                        updateStudyGuideObject(key, "summary", text);
                      }}
                      defaultValue={studyGuide.extractedData[key]["summary"]}
                      editMode={editMode}
                    />
                  </TopicSubContainer>
                  <TopicSubContainer>
                    <ImageAndTitle>
                      <Image
                        src={youtube}
                        alt="YouTube Logo"
                        width={48}
                        height={48}
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
                  </TopicSubContainer>
                  <TopicSubContainer>
                    <ImageAndTitle>
                      <Image
                        src={textbook}
                        alt="Textbook Logo"
                        width={48}
                        height={48}
                      />
                      <strong style={{ fontWeight: "bold" }}>Example:</strong>
                    </ImageAndTitle>
                    <AutoResizeTextArea
                      key={editMode} // Trigger re-render when edit mode changes
                      onChange={(text) => {
                        updateStudyGuideObject(key, "example", text);
                      }}
                      defaultValue={studyGuide.extractedData[key]["example"]}
                      editMode={editMode}
                    />
                  </TopicSubContainer>
                  <TopicSubContainer>
                    <ImageAndTitle>
                      <Image
                        src={question}
                        alt="Question Logo"
                        width={48}
                        height={48}
                      />
                      <strong style={{ fontWeight: "bold" }}>Question:</strong>
                    </ImageAndTitle>
                    <AutoResizeTextArea
                      key={editMode} // Trigger re-render when edit mode changes
                      onChange={(text) => {
                        updateStudyGuideObject(key, "question", text);
                      }}
                      defaultValue={studyGuide.extractedData[key]["question"]}
                      editMode={editMode}
                    />
                  </TopicSubContainer>
                  <TopicSubContainer>
                    <TopicAnswerContainer>
                      <ImageAndTitle>
                        <Image
                          src={check}
                          alt="Check Mark Logo"
                          width={48}
                          height={48}
                        />
                        <strong style={{ fontWeight: "bold" }}>Answer:</strong>
                      </ImageAndTitle>
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
                    </TopicAnswerContainer>
                    {collapsedAnswers[key] && (
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
          {isFileShown && <FileContainer>{content}</FileContainer>}
          {/* Pass studyGuide to Chatbot component */}
          {/* Pass function to chatbot that minimizes it */}
          {isChatbotShown && (
            <Chatbot
              studyGuide={studyGuide}
              setIsChatbotShown={setIsChatbotShown}
            />
          )}
        </OutputSection>
      </Section>
      <ShareModal
        studyGuideId={id}
        isOpen={isShareModalOpen}
        onRequestClose={closeShareModal}
      />
      <ConfirmationDialog
        isOpen={isDiscardEditsDialogOpen}
        onClose={() => setIsDiscardEditsDialogOpen(false)}
        title="Discard Edits"
        text="Are you sure you want to discard all edits?"
        onConfirm={() => {
          setIsDiscardEditsDialogOpen(false);
          discardEdits();
        }}
      />
    </PageContainer>
  );
};

export default Study;

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
  border: none;
  font-size: ${fontSize.heading};
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 8px;
  text-align: center;
  background-color: #f03a4770;
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
const SaveButtonArea = styled.div`
  display: flex;
  position: absolute;
  left: 32px;
  cursor: pointer;
  gap: 8px;
`;
const MenuTriggerArea = styled.div`
  position: absolute;
  right: 32px;
  cursor: pointer;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding-left: 10px; // padding to make element easier to click
  padding-right: 10px;
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
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

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.75;
  justify-content: center;
  align-items: center;
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
  margin-left: 16px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 30px;
  cursor: pointer;
`;

const TopicHeaderTitle = styled.div`
  font-size: ${fontSize.subheading};
  font-weight: bold;
  padding: 16px;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: #000000;
    margin-top: 10px;
  }
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
