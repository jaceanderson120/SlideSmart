import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { getUserStudyGuides, deleteStudyGuide } from "@/firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { faUserCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { Tooltip } from "react-tooltip";

const MyStudyGuides = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const router = useRouter();

  // Fetch the study guides when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const guides = await getUserStudyGuides(user);

        // Sort the study guides by created date
        guides.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setStudyGuides(guides);
      } else {
        // Redirect to login page if no user is authenticated
        router.push("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // Toggle the options menu for a study guide
  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  // Handle the view button click
  const handleView = (id) => {
    router.push(`/study/${id}`);
  };

  // Function to handle the create new button click
  const handleCreateNew = () => {
    // redirect to landing page
    router.push("/");
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
      <Section>
        <TopContainer>
          <PageTitle>My Study Guides</PageTitle>
          <ButtonContainer>
            <CreateButton onClick={handleCreateNew}>Create New</CreateButton>
          </ButtonContainer>
        </TopContainer>
        <TableContainer>
          <ColumnNamesContainer>
            <ColumnName>Name</ColumnName>
            <ColumnName>Created</ColumnName>
            <ColumnName>Contributers</ColumnName>
            <OptionsPadding />
          </ColumnNamesContainer>
          <StudyGuideListContainer>
            {studyGuides?.length > 0 ? (
              <ul>
                {studyGuides.map((guide) => {
                  return (
                    <StudyGuideListItem key={guide.id}>
                      <StudyGuideLink onClick={() => handleView(guide.id)}>
                        <h2>{guide.fileName}</h2>
                      </StudyGuideLink>
                      <StudyGuideCreated>{guide.createdAt}</StudyGuideCreated>
                      <StudyGuideContributers>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          size="lg"
                          data-tooltip-id="contributers-tooltip"
                          data-tooltip-content={auth.currentUser.email}
                          data-tooltip-place="left"
                        />
                        <Tooltip
                          id="contributers-tooltip"
                          style={{
                            backgroundColor: "#9c9c9c",
                            fontSize: "1rem",
                            padding: "8px",
                          }}
                        />
                      </StudyGuideContributers>
                      <StudyGuideOptionsButton
                        onClick={() => toggleMenu(guide.id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} size="2x" />
                        {menuVisible === guide.id && (
                          <OptionsMenu>
                            <Option onClick={() => handleView(guide.id)}>
                              View
                            </Option>
                            <Option onClick={() => handleDelete(guide)}>
                              Delete
                            </Option>
                            <Option onClick={() => toggleMenu(null)}>
                              Close Menu
                            </Option>
                          </OptionsMenu>
                        )}
                      </StudyGuideOptionsButton>
                    </StudyGuideListItem>
                  );
                })}
              </ul>
            ) : (
              <p>No study guides found.</p>
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

const StudyGuideContributers = styled.div`
  display: flex;
  flex: 1;
  color: #9c9c9c;
`;

const StudyGuideOptionsButton = styled.button`
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

const OptionsMenu = styled.div`
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #9c9c9c;
  z-index: 1000;
`;

const Option = styled.div`
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #f03a47;
    color: white;
  }
`;
