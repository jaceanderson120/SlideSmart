import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase";
import styled from "styled-components";
import Navbar from "@/components/page/Navbar";
import {
  getUserStudyGuides,
  deleteStudyGuide,
  getUserDisplayName,
} from "@/firebase/database";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { Tooltip } from "react-tooltip";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import { fontSize } from "@/constants/fontSize";
import CustomMenu from "@/components/CustomMenu";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserIcon from "@/components/UserIcon";
import Button from "@/components/Button";
import CreateModal from "@/components/modals/CreateModal";
import { colors } from "@/constants/colors";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Head from "next/head";

const Dashboard = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const [filteredStudyGuides, setFilteredStudyGuides] = useState([]);
  const [studyGuidesLoaded, setStudyGuidesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [displayNames, setDisplayNames] = useState({});
  const [displayNamesLoaded, setDisplayNamesLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sorting, setSorting] = useState("Last Modified");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { isLoggedIn, currentUser, hasSpark } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to determine if useAuthRedirect has finished
  const [checkingAuth, setCheckingAuth] = useState(true);
  useAuthRedirect(() => {
    setCheckingAuth(false);
  });

  // Fetch the study guides when the component mounts
  useEffect(() => {
    const fetchStudyGuides = async () => {
      const guides = await getUserStudyGuides(currentUser);
      if (!guides) {
        setDisplayNamesLoaded(true);
        setStudyGuidesLoaded(true);
        return;
      }
      // If all guides are null, return
      if (guides.every((guide) => guide === null)) {
        setDisplayNamesLoaded(true);
        setStudyGuidesLoaded(true);
        return;
      }
      // Sort the study guides by created date
      if (guides.length > 0) {
        guides.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
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
      setDisplayNamesLoaded(true);
    };

    if (studyGuides.length > 0) {
      fetchDisplayNames();
    }
  }, [studyGuides]);

  // Filter and sort study guides based on selected options
  useEffect(() => {
    // First filter the guides
    let filtered = [];
    if (filter === "all") {
      filtered = studyGuides;
    } else if (filter === "owned") {
      filtered = studyGuides.filter(
        (guide) => guide.createdBy === currentUser?.uid
      );
    } else if (filter === "shared") {
      filtered = studyGuides.filter(
        (guide) => guide.createdBy !== currentUser?.uid
      );
    } else if (filter === "public") {
      filtered = studyGuides.filter((guide) => guide.gotFromPublic === true);
    }

    // Then sort the filtered guides
    let sorted = [...filtered];
    if (sorting === "A-Z") {
      sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
    } else if (sorting === "Z-A") {
      sorted.sort((a, b) => b.fileName.localeCompare(a.fileName));
    } else if (sorting === "Date Created") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sorting === "Last Modified") {
      sorted.sort((a, b) => {
        const dateA = a.lastModified.toDate();
        const dateB = b.lastModified.toDate();
        return dateB - dateA;
      });
    }

    setFilteredStudyGuides(sorted);
  }, [filter, sorting, studyGuides, currentUser]);

  // Set filter to "all"
  const setFilterAll = () => {
    setFilter("all");
  };

  // Set filter to "owned"
  const setFilterOwned = () => {
    setFilter("owned");
  };

  // Set filter to "shared"
  const setFilterShared = () => {
    setFilter("shared");
  };

  // Set filter to "public"
  const setFilterPublic = () => {
    setFilter("public");
  };

  // Set sorting to "A-Z"
  const setSortAtoZ = () => {
    setSorting("A-Z");
  };

  // Set sorting to "Z-A"
  const setSortZtoA = () => {
    setSorting("Z-A");
  };

  // Set sorting to "Date Created"
  const setSortDateCreated = () => {
    setSorting("Date Created");
  };

  // Set sorting to "Last Modified"
  const setSortDateModified = () => {
    setSorting("Last Modified");
  };

  // Handle the view button click
  const handleView = (id) => {
    router.push(`/study/${id}`);
  };

  // Function to handle when the create new button is clicked
  const handleCreateNewClick = () => {
    if (isLoggedIn) {
      setIsModalOpen(true);
    } else {
      router.push("/login");
    }
  };

  const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to handle the file selection/upload
  const handleUploadSubmit = async (
    file,
    isPublic,
    includeVideos,
    includeExamples,
    includeQuestions,
    includeResources
  ) => {
    setIsLoading(true);
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingPercentage((prev) => {
        const newPercentage = prev + getRandomInRange(3, 5);
        return newPercentage > 100 ? 100 : newPercentage;
      });
    }, 1000);

    const fileExtension = file.name.split(".").pop();

    if (fileExtension !== "pdf" && fileExtension !== "pptx") {
      clearInterval(interval);
      setIsLoading(false);
      toast.error("Invalid file type. Please upload a PDF or PPTX file.");
      // Reset the file input element
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    const studyGuideId = await handleFileUpload(
      file,
      isPublic,
      includeVideos,
      includeExamples,
      includeQuestions,
      includeResources,
      currentUser
    );
    clearInterval(interval);
    setIsLoading(false);
    // fileUpload response is either an object with studyGuideId and an error
    if (studyGuideId !== null) {
      router.push(`/study/${studyGuideId}`);
    }
  };

  // Handle the delete button click
  const handleDelete = (guide) => {
    // Delete the study guide from the database
    deleteStudyGuide(guide.id, guide.firebaseFileUrl, auth.currentUser.uid);

    // Update the study guides state to remove the deleted study guide
    setStudyGuides(
      studyGuides.filter((studyGuide) => studyGuide.id !== guide.id)
    );
  };

  return (
    <>
      <Head>
        <title>SlideSmart - Dashboard</title>
        <meta
          name="description"
          content="Access your dashboard to create, view, and manage your study guides."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/dashboard" />
      </Head>
      {!checkingAuth && (
        <Container>
          <Navbar />
          {isLoading ? (
            <Overlay>
              <ProgressWrapper>
                <CircularProgressbar
                  value={loadingPercentage}
                  text={`${loadingPercentage}%`}
                  styles={buildStyles({
                    pathColor: colors.primary,
                    textColor: colors.black,
                  })}
                />
              </ProgressWrapper>
            </Overlay>
          ) : (
            <></>
          )}
          <Section>
            <TopContainer>
              <PageTitle>Dashboard</PageTitle>
              {isLoggedIn && (
                <ButtonContainer>
                  <Button
                    onClick={handleCreateNewClick}
                    padding="16px"
                    bold
                    fontSize={fontSize.subheading}
                  >
                    Create New
                  </Button>
                </ButtonContainer>
              )}
              <CreateModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onUpload={handleUploadSubmit}
              ></CreateModal>
            </TopContainer>
            <TableContainer>
              <FilterSortContainer>
                <FilterContainer>
                  <FilterLabel>Filter:</FilterLabel>
                  <CustomMenu
                    triggerElement={
                      <MenuTrigger>
                        {filter === "all"
                          ? "All"
                          : filter === "owned"
                          ? "Owned by Me"
                          : filter === "shared"
                          ? "Shared with Me"
                          : "Downloaded Publically"}
                      </MenuTrigger>
                    }
                    menuItems={[
                      { name: "All", onClick: setFilterAll },
                      { name: "Owned by Me", onClick: setFilterOwned },
                      { name: "Shared with Me", onClick: setFilterShared },
                      {
                        name: "Downloaded Publically",
                        onClick: setFilterPublic,
                      },
                    ]}
                    arrow={true}
                  />
                </FilterContainer>
                <FilterContainer>
                  <FilterLabel>Sort:</FilterLabel>
                  <CustomMenu
                    triggerElement={
                      <MenuTrigger>
                        {sorting === "A-Z"
                          ? "A-Z"
                          : sorting === "Z-A"
                          ? "Z-A"
                          : sorting === "Date Created"
                          ? "Date Created"
                          : "Last Modified"}
                      </MenuTrigger>
                    }
                    menuItems={[
                      { name: "A-Z", onClick: setSortAtoZ },
                      { name: "Z-A", onClick: setSortZtoA },
                      { name: "Date Created", onClick: setSortDateCreated },
                      { name: "Last Modified", onClick: setSortDateModified },
                    ]}
                    arrow={true}
                  />
                </FilterContainer>
              </FilterSortContainer>
              <ColumnNamesContainer>
                <ColumnName $flex={2}>Name</ColumnName>
                <ColumnName $flex={1}>Created</ColumnName>
                <ColumnName $flex={1}>Permission</ColumnName>
                <ColumnName $flex={1}>Contributors</ColumnName>
                <ColumnName $flex={1}>Visibility</ColumnName>
                <OptionsPadding />
              </ColumnNamesContainer>
              <StudyGuideListContainer>
                {filteredStudyGuides?.length > 0 && displayNamesLoaded ? (
                  <ul>
                    {filteredStudyGuides.map((guide) => {
                      return (
                        <StudyGuideListItem key={guide.id}>
                          <StudyGuideLink onClick={() => handleView(guide.id)}>
                            {guide.fileName}
                          </StudyGuideLink>
                          <StudyGuideCreated>
                            {guide.createdAt}
                          </StudyGuideCreated>
                          <StudyGuidePermission>
                            {guide.createdBy === currentUser?.uid
                              ? "Owner"
                              : guide.editors.includes(currentUser?.uid)
                              ? "Editor"
                              : "Viewer"}
                          </StudyGuidePermission>
                          <StudyGuideContributors>
                            {guide.contributors.map((contributor) => {
                              return (
                                <Contributor key={contributor}>
                                  <UserIcon
                                    initials={
                                      displayNames[contributor]
                                        ? displayNames[contributor]
                                            .split(" ")
                                            .map((name) => name[0])
                                            .join("")
                                        : "?"
                                    }
                                    data-tooltip-id={`contributor-tooltip-${contributor}`}
                                    data-tooltip-content={
                                      displayNames[contributor] || "Loading..."
                                    }
                                    data-tooltip-place="left"
                                  />
                                  <Tooltip
                                    id={`contributor-tooltip-${contributor}`}
                                    // Doesn't work with styled-components
                                    style={{
                                      backgroundColor: colors.primary,
                                      fontSize: `${fontSize.secondary}`,
                                      padding: "8px",
                                    }}
                                  />
                                </Contributor>
                              );
                            })}
                          </StudyGuideContributors>
                          <StudyGuideVisibility>
                            {guide.isPublic ? "Public" : "Private"}
                          </StudyGuideVisibility>
                          {guide.createdBy === currentUser?.uid ? (
                            <StudyGuideDeleteButton
                              onClick={() => {
                                setIsDeleteDialogOpen(true);
                                setGuideToDelete(guide);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                size="2x"
                                color={colors.black}
                              />
                            </StudyGuideDeleteButton>
                          ) : (
                            <OptionsPadding />
                          )}
                        </StudyGuideListItem>
                      );
                    })}
                  </ul>
                ) : !studyGuidesLoaded ? (
                  <StudyGuidesInfoText>
                    Finding your study guides...
                  </StudyGuidesInfoText>
                ) : displayNamesLoaded ? (
                  <StudyGuidesInfoText>
                    No study guides found.
                  </StudyGuidesInfoText>
                ) : (
                  <StudyGuidesInfoText>
                    Loading contributors...
                  </StudyGuidesInfoText>
                )}
              </StudyGuideListContainer>
            </TableContainer>
          </Section>
          <ConfirmationModal
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            title="Are you sure you want to delete this study guide?"
            text={`"${guideToDelete?.fileName}"\nwill be permanently deleted.`}
            onConfirm={() => {
              setIsDeleteDialogOpen(false);
              handleDelete(guideToDelete);
              toast.success("Study guide deleted successfully.");
            }}
            icon={
              <FontAwesomeIcon
                icon={faTrashCan}
                size="3x"
                color={colors.primary}
              />
            }
          />
        </Container>
      )}
    </>
  );
};

export default Dashboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${colors.lightGray};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  color: ${colors.black};
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
  margin-bottom: 32px;
`;

const FilterLabel = styled.label`
  font-size: ${fontSize.default};
  font-weight: bold;
  margin-right: 8px;
`;

const MenuTrigger = styled.p`
  cursor: pointer;
  font-size: ${fontSize.default};
`;

const PageTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  display: flex;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  overflow-y: auto;
`;

const ColumnNamesContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ColumnName = styled.h2`
  margin-bottom: 16px;
  display: flex;
  flex: ${(props) => props.$flex};
  font-size: ${fontSize.default};
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
  background-color: ${colors.white};
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
`;

const StudyGuideListItem = styled.div`
  display: flex;
  padding: 8px;
  border-bottom: 1px solid ${colors.gray};
  align-items: center;
  width: 100%;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

const StudyGuideLink = styled.div`
  display: block;
  flex: 2;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: ${fontSize.default};
  transition: color 0.3s, transform 0.3s;
  min-width: 0;

  &:hover {
    color: ${colors.primary};
    transform: scale(1.02);
  }
`;

const StudyGuideCreated = styled.div`
  display: flex;
  flex: 1;
  color: ${colors.gray};
  font-size: ${fontSize.default};
`;

const StudyGuidePermission = styled.div`
  display: flex;
  flex: 1;
  color: ${colors.gray};
  font-size: ${fontSize.default};
`;

const StudyGuideContributors = styled.div`
  display: flex;
  flex: 1;
  color: ${colors.gray};
`;

const StudyGuideVisibility = styled.div`
  display: flex;
  flex: 1;
  color: ${colors.gray};
  font-size: ${fontSize.default};
`;

const Contributor = styled.div`
  margin-right: 8px;
  font-size: ${fontSize.heading};
`;

const StudyGuideDeleteButton = styled.button`
  display: flex;
  flex: 0.1;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:hover svg {
    color: ${colors.primary};
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
  font-size: ${fontSize.default};
  margin: 16px;
`;

const FilterSortContainer = styled.div`
  display: flex;
  gap: 16px;
`;
