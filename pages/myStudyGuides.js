import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import {
  getUserStudyGuides,
  deleteStudyGuide,
  getUserDisplayName,
} from "@/firebase/database";
import { faUserCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { Tooltip } from "react-tooltip";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useStateContext } from "@/context/StateContext";

const MyStudyGuides = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const [filteredStudyGuides, setFilteredStudyGuides] = useState([]);
  const [studyGuidesLoaded, setStudyGuidesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [displayNames, setDisplayNames] = useState({});
  const [filter, setFilter] = useState("owned");
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { isLoggedIn, currentUser } = useStateContext();

  // Fetch the study guides when the component mounts
  useEffect(() => {
    const fetchStudyGuides = async () => {
      const guides = await getUserStudyGuides(currentUser);
      if (!guides) {
        return;
      }
      // Sort the study guides by created date
      guides.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setStudyGuides(guides);
      setStudyGuidesLoaded(true);
    };
    if (currentUser) {
      fetchStudyGuides();
    }
  }, [currentUser, router]);

  // Fetch display names for contributors
  useEffect(() => {
    const fetchDisplayNames = async () => {
      const names = {};
      for (const guide of studyGuides) {
        for (const contributor of guide.contributors) {
          if (!names[contributor]) {
            names[contributor] = await getUserDisplayName(contributor);
          }
        }
      }
      setDisplayNames(names);
    };

    if (studyGuides.length > 0) {
      fetchDisplayNames();
    }
  }, [studyGuides]);

  // Filter study guides based on the selected filter
  useEffect(() => {
    if (filter === "owned") {
      setFilteredStudyGuides(
        studyGuides.filter((guide) => guide.createdBy === currentUser?.uid)
      );
    } else if (filter === "shared") {
      setFilteredStudyGuides(
        studyGuides.filter((guide) => guide.createdBy !== currentUser?.uid)
      );
    }
  }, [filter, studyGuides, currentUser]);

  // Handle the view button click
  const handleView = (id) => {
    router.push(`/study/${id}`);
  };

  // Function to handle the button click and open the file selector
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle when the create new button is clicked
  const handleClick = () => {
    // Check if the user is logged in
    if (isLoggedIn) {
      handleUploadClick();
    } else {
      router.push("/login");
    }
  };

  const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to handle the create new button click
  const handleCreateNew = async (event) => {
    setIsLoading(true);
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingPercentage((prev) => {
        const newPercentage = prev + getRandomInRange(3, 5);
        return newPercentage > 100 ? 100 : newPercentage;
      });
    }, 1000);
    const studyGuideId = await handleFileUpload(event, currentUser);
    clearInterval(interval);
    setIsLoading(false);
    if (studyGuideId) {
      router.push(`/study/${studyGuideId}`);
    }
  };

  // Handle the delete button click
  const handleDelete = (guide) => {
    deleteStudyGuide(guide.id, guide.firebaseFileUrl, auth.currentUser.uid);
    // Update the study guides state to remove the deleted study guide
    setStudyGuides(
      studyGuides.filter((studyGuide) => studyGuide.id !== guide.id)
    );
  };

  return (
    <Container>
      <Navbar />
      {isLoading ? (
        <Overlay>
          <ProgressWrapper>
            <CircularProgressbar value={loadingPercentage} />
          </ProgressWrapper>
        </Overlay>
      ) : (
        <></>
      )}
      <Section>
        <TopContainer>
          <PageTitle>My Study Guides</PageTitle>
          {isLoggedIn && (
            <ButtonContainer>
              <CreateButton onClick={handleClick}>Create New</CreateButton>
            </ButtonContainer>
          )}
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleCreateNew}
          />
        </TopContainer>
        <TableContainer>
          <FilterContainer>
            <FilterLabel>Filter:</FilterLabel>
            <FilterSelect
              value={filter} // Set the value of the select element
              onChange={(e) => setFilter(e.target.value)} // Update the filter state on change
            >
              <option value="owned">Owned by Me</option>
              <option value="shared">Shared with Me</option>
            </FilterSelect>
          </FilterContainer>
          <ColumnNamesContainer>
            <ColumnName>Name</ColumnName>
            <ColumnName>Created</ColumnName>
            <ColumnName>Contributors</ColumnName>
            {filter === "owned" && <OptionsPadding />}
          </ColumnNamesContainer>
          <StudyGuideListContainer>
            {filteredStudyGuides?.length > 0 ? (
              <ul>
                {filteredStudyGuides.map((guide) => {
                  return (
                    <StudyGuideListItem key={guide.id}>
                      <StudyGuideLink onClick={() => handleView(guide.id)}>
                        <h2>{guide.fileName}</h2>
                      </StudyGuideLink>
                      <StudyGuideCreated>{guide.createdAt}</StudyGuideCreated>
                      <StudyGuideContributors>
                        {guide.contributors.map((contributor) => {
                          return (
                            <Contributor key={contributor}>
                              <FontAwesomeIcon
                                icon={faUserCircle}
                                size="lg"
                                data-tooltip-id={`contributor-tooltip-${contributor}`}
                                data-tooltip-content={
                                  displayNames[contributor] || "Loading..."
                                }
                                data-tooltip-place="left"
                              />
                              <Tooltip
                                id={`contributor-tooltip-${contributor}`}
                                style={{
                                  backgroundColor: "#9c9c9c",
                                  fontSize: "1rem",
                                  padding: "8px",
                                }}
                              />
                            </Contributor>
                          );
                        })}
                      </StudyGuideContributors>
                      {guide.createdBy === currentUser?.uid && (
                        <StudyGuideDeleteButton
                          onClick={() => handleDelete(guide)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} size="2x" />
                        </StudyGuideDeleteButton>
                      )}
                    </StudyGuideListItem>
                  );
                })}
              </ul>
            ) : !studyGuidesLoaded ? (
              <StudyGuidesInfoText>Loading...</StudyGuidesInfoText>
            ) : (
              <StudyGuidesInfoText>
                No study guides found.{" "}
                {!isLoggedIn && "Log in to view your study guides."}
              </StudyGuidesInfoText>
            )}
          </StudyGuideListContainer>
        </TableContainer>
      </Section>
    </Container>
  );
};

export default MyStudyGuides;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f4f3;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  color: #000000;
  font-size: 2rem;
  overflow-y: hidden;
  margin-bottom: 32px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 32px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 16px;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 8px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background-color: #f6f4f3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const CreateButton = styled.button`
  padding: 16px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: black;
  }
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  overflow-y: auto;
`;

const ColumnNamesContainer = styled.div`
  display: flex;
`;

const ColumnName = styled.h2`
  margin: 16px;
  display: flex;
  flex: 1;
  font-size: 1rem;
  font-weight: bold;
`;

const OptionsPadding = styled.div`
  display: flex;
  flex: 0.1;
`;

const StudyGuideListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #f03a47;
  overflow-y: auto;
`;

const StudyGuideListItem = styled.div`
  display: flex;
  padding: 8px;
  border-bottom: 1px solid #9c9c9c;
  align-items: center;
`;

const StudyGuideLink = styled.div`
  display: flex;
  flex: 1;
  margin: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1rem;

  &:hover {
    color: #f03a47;
    transition: color 0.3s;
  }
`;

const StudyGuideCreated = styled.div`
  display: flex;
  flex: 1;
  margin: 16px;
  color: #9c9c9c;
  font-size: 1rem;
`;

const StudyGuideContributors = styled.div`
  display: flex;
  flex: 1;
  color: #9c9c9c;
`;

const Contributor = styled.div`
  margin-right: 8px;
`;

const StudyGuideDeleteButton = styled.button`
  display: flex;
  flex: 0.1;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:hover svg {
    color: #f03a47;
    transition: color 0.3s;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ProgressWrapper = styled.div`
  width: 100px;
  height: 100px;
`;

const StudyGuidesInfoText = styled.p`
  font-size: 1rem;
  margin: 16px;
`;
