import { useState, useEffect, useRef } from "react";
import React from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase";
import styled, { useTheme } from "styled-components";
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
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import CustomMenu from "@/components/CustomMenu";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserIcon from "@/components/UserIcon";
import Button from "@/components/Button";
import CreateModal from "@/components/modals/CreateModal";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Head from "next/head";
import PageTitle from "@/components/page/PageTitle";
import IconButton from "@/components/IconButton";
import { Trash2 } from "lucide-react";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";


const Dashboard = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const [filteredStudyGuides, setFilteredStudyGuides] = useState([]);
  const [studyGuidesLoaded, setStudyGuidesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setloadingStatus] = useState([0, ""]);
  const [displayNames, setDisplayNames] = useState({});
  const [displayNamesLoaded, setDisplayNamesLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sorting, setSorting] = useState("Last Modified");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { isLoggedIn, currentUser } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

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

  // Callback function for handleFileUpload to update loading progress
  const updateLoadingProgress = (progress) => {
    setloadingStatus(progress);
  };

  // Function to handle the file selection/upload
  const handleUploadSubmit = async (
    file,
    isPublic,
    includeVideos,
    includeExamples,
    includeQuestions,
    includeResources,
    topic
  ) => {
    setIsLoading(true);

    if (!topic) {
      const fileExtension = file.name.split(".").pop();

      if (fileExtension !== "pdf" && fileExtension !== "pptx" && fileExtension !== "ppt") {
        clearInterval(interval);
        setIsLoading(false);
        toast.error("Invalid file type. Please upload a PDF, PPT, or PPTX file.");
        // Reset the file input element
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
    }

    const studyGuideId = await handleFileUpload(
      file,
      isPublic,
      includeVideos,
      includeExamples,
      includeQuestions,
      includeResources,
      currentUser,
      topic,
      updateLoadingProgress
    );
    setIsLoading(false);

    // Toast error messages if necessary
    if (studyGuideId == "TOKEN_ERROR") {
      toast.error(
        "The file you uploaded is too large for SlideSmart to handle. Please try again with a smaller file. (Keep in mind that file size doesn't always match the amount of content inside.)"
      );
    } else if (studyGuideId == "EMPTY_DATA") {
      toast.error(
        "The file you uploaded appears to be empty. Unfortunately, SlideSmart cannot process this file."
      );
    } else if (studyGuideId == "UNKNOWN_ERROR") {
      toast.error(
        "An unknown error occurred while processing your file. Please try again."
      );
    } else if (studyGuideId !== null) {
      router.push(`/study/${studyGuideId}`);
    } else {
      toast.error(
        "An error occurred while processing your file. Please try again."
      );
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
      <body>
        <main>
          {!checkingAuth && (
            <Container>
              <Navbar />
              {isLoading ? (
                <Overlay>
                  <ProgressWrapper>
                    <CircularProgressbarWithChildren
                      value={loadingStatus[0]}
                      styles={buildStyles({
                        pathColor: theme.primary,
                        textColor: theme.black,
                        trailColor: theme.lightGray,
                        backgroundColor: theme.white,
                        pathTransitionDuration: 35,
                      })}
                      background={true}
                    >
                      <ProgressTextContainer>
                        {loadingStatus[1]}<Dots />
                      </ProgressTextContainer>
                    </CircularProgressbarWithChildren>
                  </ProgressWrapper>
                </Overlay>
              ) : (
                <></>
              )}
              <Section>
                <TopContainer>
                  <PageTitle>DASHBOARD</PageTitle>
                  {isLoggedIn && (
                    <ButtonContainer>
                      <Button
                        onClick={handleCreateNewClick}
                        padding="16px"
                        bold
                        fontSize={({ theme }) => theme.fontSize.subheading}
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
                        {
                          name: "Last Modified",
                          onClick: setSortDateModified,
                        },
                      ]}
                      arrow={true}
                    />
                  </FilterContainer>
                </FilterSortContainer>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Name</Th>
                        <Th>Created</Th>
                        <Th>Permission</Th>
                        <Th>Contributors</Th>
                        <Th>Visibility</Th>
                        <Th>Options</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudyGuides?.length > 0 && displayNamesLoaded ? (
                        filteredStudyGuides.map((guide) => (
                          <tr key={guide.id}>
                            <Td>
                              <StudyGuideLink
                                onClick={() => handleView(guide.id)}
                              >
                                {guide.fileName}
                              </StudyGuideLink>
                            </Td>
                            <Td>{guide.createdAt}</Td>
                            <Td>
                              {guide.createdBy === currentUser?.uid
                                ? "Owner"
                                : guide.editors.includes(currentUser?.uid)
                                ? "Editor"
                                : "Viewer"}
                            </Td>
                            <Td>
                              <ContributorContainer>
                                {guide.contributors.map((contributor) => (
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
                                        displayNames[contributor] ||
                                        "Loading..."
                                      }
                                      data-tooltip-place="left"
                                    />
                                    <Tooltip
                                      id={`contributor-tooltip-${contributor}`}
                                      // Doesn't work with styled-components
                                      style={{
                                        backgroundColor: theme.primary,
                                        fontSize: theme.fontSize.secondary,
                                        padding: "8px",
                                      }}
                                    />
                                  </Contributor>
                                ))}
                              </ContributorContainer>
                            </Td>
                            <Td>{guide.isPublic ? "Public" : "Private"}</Td>
                            <Td>
                              {guide.createdBy === currentUser?.uid && (
                                <IconButton
                                  onClick={() => {
                                    setIsDeleteDialogOpen(true);
                                    setGuideToDelete(guide);
                                  }}
                                  icon={<Trash2 />}
                                  title="Delete Study Guide"
                                />
                              )}
                            </Td>
                          </tr>
                        ))
                      ) : !studyGuidesLoaded ? (
                        <tr>
                          <Td colSpan="6">Finding your study guides...</Td>
                        </tr>
                      ) : displayNamesLoaded ? (
                        <tr>
                          <Td colSpan="6">No study guides found.</Td>
                        </tr>
                      ) : (
                        <tr>
                          <Td colSpan="6">Loading contributors...</Td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
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
                    color={theme.primary}
                  />
                }
              />
            </Container>
          )}
        </main>
      </body>
    </>
  );
};

export default Dashboard;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.gray};
`;

const Th = styled.th`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.gray};
  text-align: left;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  top: 0;
  z-index: 1;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.gray};
  color: ${({ theme }) => theme.black};
  text-align: left;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.lightGray};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  color: ${({ theme }) => theme.black};
  overflow-y: hidden;
  margin-bottom: 32px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSize.default};
  font-weight: bold;
  margin-right: 8px;
`;

const MenuTrigger = styled.p`
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.default};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const StudyGuideLink = styled.div`
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.default};
  transition: color 0.3s;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ContributorContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Contributor = styled.div`
  font-size: ${({ theme }) => theme.fontSize.heading};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ProgressWrapper = styled.div`
  width: 150px;
  height: 150px;
`;

const ProgressTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.black};
  padding: 16px;
  gap: 8px;
`;

const FilterSortContainer = styled.div`
  display: flex;
  gap: 16px;
`;
