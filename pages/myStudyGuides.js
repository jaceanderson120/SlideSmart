import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../library/firebase/firebase";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { getUserStudyGuides } from "@/firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const MyStudyGuides = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const router = useRouter();

  // Fetch the study guides when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const guides = await getUserStudyGuides(user);
        setStudyGuides(guides);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleGuideClick = (guide) => {
    router.push(`/study/${guide.id}`);
  };

  return (
    <div>
      <Navbar />
      <Section>
        <h1>My Study Guides</h1>
        {studyGuides?.length > 0 ? (
          <ul>
            {studyGuides.map((guide) => {
              return (
                <StudyGuideLink
                  key={guide.id}
                  onClick={() => handleGuideClick(guide)}
                >
                  <h2>{guide.fileName}</h2>
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
