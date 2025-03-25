import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StudyGuideTopics from "./StudyGuideTopics";
import Image from "next/image";
import logo from "@/images/logo.png";
import IconButton from "../IconButton";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardX,
  File,
  Forward,
  LayoutDashboard,
  MessageSquare,
  MoonStar,
  Pencil,
  Save,
  Search,
  Sun,
  Zap,
} from "lucide-react";
import { useStateContext } from "@/context/StateContext";
import Button from "../Button";
import { useRouter } from "next/router";
import {
  getUserStudyGuides,
  updateStudyGuideFileName,
} from "@/firebase/database";
import { useTheme } from "@/context/ThemeContext";

const Sidebar = ({
  studyGuideId,
  creator,
  topics,
  editMode,
  onDragEnd,
  setIsAddTopicModalOpen,
  activeTopic,
  fileName,
  setFileName,
  handleEditClicked,
  handleShareClick,
  handleChatbotToggle,
  isChatbotShown,
  handleFileToggle,
  isFileShown,
  hasFirebaseUrl,
  handleFlashcardClick,
  fromSearch,
  searchQuery,
  saveStudyGuide,
  contributors,
  setIsDiscardEditsDialogOpen,
  editors,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studyGuidesList, setStudyGuidesList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { currentUser } = useStateContext();
  const router = useRouter();
  const titleInputRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  // Function to toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle pressing Enter key to blur the title input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      titleInputRef.current.blur();
    }
  };

  // Update the file name that is displayed at the top of the study guide
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Save the file name to Firestore when the input field is blurred
  const handleFileNameSave = async () => {
    if (fileName.length < 1) {
      setFileName("Untitled Study Guide");
      updateStudyGuideFileName(studyGuideId, "Untitled Study Guide");
    } else {
      updateStudyGuideFileName(studyGuideId, fileName);
    }
  };

  // Fetch the study guides when the component mounts
  useEffect(() => {
    const fetchStudyGuides = async () => {
      const currentStudyGuideId = router.query.id;
      const guides = await getUserStudyGuides(currentUser);
      if (!guides) {
        return;
      }

      // If all guides are null, return
      if (guides.every((guide) => guide === null)) {
        return;
      }

      // Sort the study guides by created date and filter out the current study guide
      const filteredGuides = guides
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .filter((guide) => guide.id !== currentStudyGuideId);

      setStudyGuidesList(filteredGuides);
    };
    if (currentUser) {
      fetchStudyGuides();
    }
  }, [currentUser, router]);

  // Handle title click to toggle dropdown visibility
  const handleTitleClick = () => {
    if (!editMode) {
      setDropdownVisible(!dropdownVisible);
    }
  };

  // Handle study guide selection from the dropdown
  const handleStudyGuideSelect = (id) => {
    router.push(`/study/${id}`);
    setDropdownVisible(false);
  };

  return (
    <SidebarContainer $collapsed={sidebarCollapsed}>
      <SidebarTop>
        <Image src={logo} alt="logo" width={50} height={50} />
        <IconButton
          icon={sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          title="Collapse Sidebar"
          onClick={toggleSidebarCollapse}
        />
      </SidebarTop>
      {!sidebarCollapsed && (
        <>
          <StudyGuideDivider>
            <BackToContainer>
              <Button
                onClick={() => {
                  if (fromSearch) {
                    router.push(`/find-slides?searchQuery=${searchQuery}`);
                  } else {
                    router.push("/dashboard");
                  }
                }}
                padding="0px"
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                textColor={({ theme }) => theme.black}
                hoverTextColor={({ theme }) => theme.primary}
              >
                <ArrowLeft />
                {fromSearch ? "Back to Search" : "Back to Dashboard"}
              </Button>
            </BackToContainer>
            {!contributors.includes(currentUser.uid) && (
              <Button onClick={saveStudyGuide}>Save File</Button>
            )}
          </StudyGuideDivider>
          <TitleContainer onClick={handleTitleClick}>
            <Title
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              onBlur={handleFileNameSave}
              onKeyDown={handleKeyDown}
              ref={titleInputRef}
              readOnly={
                editMode && editors.includes(currentUser.uid) ? false : true
              }
              $editMode={editMode}
            />
            <ChevronDown />
            {dropdownVisible && (
              <Dropdown>
                {studyGuidesList.map((guide) => (
                  <DropdownItem
                    key={guide.id}
                    onClick={() => handleStudyGuideSelect(guide.id)}
                  >
                    {guide.fileName}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </TitleContainer>
          <StudyGuideTopicsContainer>
            <StudyGuideTopics
              topics={topics}
              editMode={editMode}
              onDragEnd={onDragEnd}
              setIsAddTopicModalOpen={setIsAddTopicModalOpen}
              activeTopic={activeTopic}
            />
          </StudyGuideTopicsContainer>
          <StudyGuideDivider>Tools</StudyGuideDivider>
        </>
      )}
      {sidebarCollapsed && (
        <ToolContainer
          onClick={() => {
            if (fromSearch) {
              router.push(`/find-slides?searchQuery=${searchQuery}`);
            } else {
              router.push("/dashboard");
            }
          }}
          $sidebarCollapsed={sidebarCollapsed}
        >
          {fromSearch ? <Search /> : <LayoutDashboard />}
          {fromSearch ? "Back to Search" : "Back to Dashboard"}
        </ToolContainer>
      )}
      {editMode && editors.includes(currentUser.uid) ? (
        <>
          <ToolContainer
            onClick={handleEditClicked}
            $sidebarCollapsed={sidebarCollapsed}
          >
            <Save />
            Save Changes
          </ToolContainer>
          <ToolContainer
            onClick={() => setIsDiscardEditsDialogOpen(true)}
            $sidebarCollapsed={sidebarCollapsed}
          >
            <ClipboardX />
            Discard Changes
          </ToolContainer>
        </>
      ) : editors.includes(currentUser.uid) ? (
        <ToolContainer
          onClick={handleEditClicked}
          $sidebarCollapsed={sidebarCollapsed}
        >
          <Pencil />
          Edit
        </ToolContainer>
      ) : (
        <></>
      )}
      {currentUser.uid == creator && (
        <ToolContainer
          onClick={handleShareClick}
          $sidebarCollapsed={sidebarCollapsed}
        >
          <Forward />
          Share
        </ToolContainer>
      )}
      <ToolContainer
        onClick={handleChatbotToggle}
        $sidebarCollapsed={sidebarCollapsed}
      >
        <MessageSquare />
        {isChatbotShown ? "Hide" : "Chat with"} Sola
      </ToolContainer>
      {creator === currentUser.uid && hasFirebaseUrl && (
        <ToolContainer
          onClick={handleFileToggle}
          $sidebarCollapsed={sidebarCollapsed}
        >
          <File />
          {isFileShown ? "Hide" : "Show"} Original File
        </ToolContainer>
      )}
      {currentUser.uid == creator && (
        <ToolContainer
          onClick={handleFlashcardClick}
          $sidebarCollapsed={sidebarCollapsed}
        >
          <Zap />
          Flashcards
        </ToolContainer>
      )}
      <ToolContainer
        onClick={toggleDarkMode}
        $sidebarCollapsed={sidebarCollapsed}
      >
        {darkMode ? <Sun /> : <MoonStar />}
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </ToolContainer>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${({ theme }) => theme.lightGray};
  width: ${({ $collapsed }) => ($collapsed ? "100px" : "300px")};
  max-width: 300px;
  transition: width 0.3s ease;
  border-right: 1px solid ${({ theme }) => theme.black};
  overflow-y: auto;
`;

const SidebarTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StudyGuideDivider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.gray};
  margin: 16px 0;
  padding-bottom: 16px;
  font-size: ${({ theme }) => theme.fontSize.secondary};
`;

const StudyGuideTopicsContainer = styled.div`
  display: flex;
  flex-direction: column;
  scrollbar-color: ${({ theme }) => theme.primary70} transparent;
  overflow-y: auto;
`;

const ToolContainer = styled.div`
  display: flex;
  flex-direction: ${({ $sidebarCollapsed }) =>
    $sidebarCollapsed ? "column" : "row"};
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  line-height: 1.3;
  padding: 10px;
  font-size: ${({ theme }) => theme.fontSize.secondary};
  gap: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const BackToContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TitleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.white};
  transition: color 0.3s;
  cursor: pointer;
`;

const Title = styled.input`
  font-size: ${({ theme }) => theme.fontSize.default};
  text-overflow: ellipsis;
  background-color: transparent;
  overflow: hidden;
  white-space: nowrap;
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
  outline: none;
  cursor: ${({ $editMode }) => ($editMode ? "text" : "pointer")};
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gray};
  border-radius: 4px;
  box-shadow: 0 2px 4px ${({ theme }) => theme.shadow};
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 8px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.black};
  &:hover {
    background-color: ${({ theme }) => theme.primary70};
  }
`;
