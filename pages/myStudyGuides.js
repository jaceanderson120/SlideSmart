import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../library/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import styled from "styled-components";
import Navbar from "@/components/Navbar";

const MyStudyGuides = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const router = useRouter();

  // Get all user's study guides
  const getStudyGuides = async () => {
    const user = auth.currentUser;

    if (user) {
      // Fetch the user's study guide IDs from the userStudyGuides collection
      const userDocRef = doc(db, "userStudyGuides", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const { studyGuides: studyGuideIds } = userDoc.data();

        // Fetch the study guide documents from the studyGuides collection
        const studyGuidesPromises = studyGuideIds.map(async (id) => {
          const studyGuideDocRef = doc(db, "studyGuides", id);
          const studyGuideDoc = await getDoc(studyGuideDocRef);
          const data = studyGuideDoc.data();
          return {
            id: studyGuideDoc.id,
            extractedData: JSON.parse(data.extractedData),
          };
        });

        const guides = await Promise.all(studyGuidesPromises);
        setStudyGuides(guides);
      }
    }
  };

  useEffect(() => {
    getStudyGuides();
  }, []);

  const handleGuideClick = (guide) => {
    router.push(`/study/${guide.id}`);
  };

  return (
    <div>
      <Navbar />
      <Section>
        <h1>My Study Guides</h1>
        {studyGuides.length > 0 ? (
          <ul>
            {studyGuides.map((guide) => {
              const firstKey = Object.keys(guide.extractedData)[0];
              return (
                <StudyGuideLink
                  key={guide.id}
                  onClick={() => handleGuideClick(guide)}
                >
                  <h2>{firstKey}</h2>
                </StudyGuideLink>
              );
            })}
          </ul>
        ) : (
          <p>No study guides found.</p>
        )}
      </Section>
    </div>
  );
};

export default MyStudyGuides;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10vw;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
`;

const StudyGuideLink = styled.div`
  margin: 16px;
  padding: 16px;
  border: 1px solid #000000;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f03a47;
    color: #ffffff;
  }
`;
