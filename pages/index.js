import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingOverlay from "../components/Overlay";
import { auth } from "@/library/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to handle the button click and open the file selector
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle the file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      try {
        setIsLoading(true); // Show loading spinner
        // Start with extracting data from the form
        const response = await fetch("/api/extract-from-pdf", {
          method: "POST",
          body: formData,
        });

        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} ${errorText}`);
        }

        // Get the extracted data as a string
        const extractedData = await response.json();

        // Send extracted data to GPT to retrieve topics + summaries object from data
        const topicsAndSummariesResponse = await fetch("/api/get-topics-gpt", {
          method: "POST",
          body: extractedData,
        });

        // Check if topicsAndSummariesResponse is OK
        if (!topicsAndSummariesResponse.ok) {
          throw new Error("Failed to fetch topics and summaries");
        }

        // Get the topics and summaries as JSON
        const topicsAndSummaries = await topicsAndSummariesResponse.json();
        const topics = Object.keys(topicsAndSummaries); // Extracting topics

        // Get the YouTube search queries for each topic
        const queries = topics.map((topic) => topicsAndSummaries[topic][1]);

        // Prepare an array of fetch promises for YouTube videos
        const youtubePromises = queries.map((query) =>
          fetch("/api/get-youtube-video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }), // Sending the topic as JSON
          }).then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch video");
            }
            return res.json(); // Return the video ID
          })
        );

        // Prepare the fetch for create-content
        const createContentPromise = fetch("/api/create-content-gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topicsAndSummaries),
        });

        // Wait for both the YouTube video and create content fetches to complete
        const [youtubeResponses, createdContentResponse] = await Promise.all([
          Promise.all(youtubePromises), // Resolve all YouTube video fetches
          createContentPromise, // Resolve create content fetch
        ]);

        // Check if createdContentResponse is OK
        if (!createdContentResponse.ok) {
          throw new Error("Failed to create content");
        }

        // Get the created content as JSON
        const createdContent = await createdContentResponse.json();

        // Combine the responses into one object
        const combinedResponse = {};
        topics.forEach((topic, index) => {
          combinedResponse[topic] = {
            summary: topicsAndSummaries[topic],
            question: createdContent[topic]?.question || "",
            answer: createdContent[topic]?.answer || "",
            youtubeId: youtubeResponses[index],
          };
        });

        setIsLoading(false);

        // Redirect to the study page with extracted data
        router.push({
          pathname: "/study",
          query: { extractedData: JSON.stringify(combinedResponse) },
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      {isLoading ? <LoadingOverlay /> : <></>}
      <Section>
        <Slogan>
          The{" "}
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>Smart</span>{" "}
          Way to
        </Slogan>
        <Slogan>
          Study{" "}
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>Slides</span>
        </Slogan>

        <p style={{ fontSize: "18px", transform: "translateY(-120px)" }}>
          A software tool that creates comprehensive/interactive Study Guides
          equipped{" "}
        </p>
        <p style={{ fontSize: "18px", transform: "translateY(-120px)" }}>
          with plenty of useful resources to help you succeed in the classroom
        </p>

        {/* Button that triggers the file input click */}
        <UploadButton
          onClick={() => {
            if (isLoggedIn) {
              handleUploadClick();
            } else {
              alert("Please log in to use this feature.");
            }
          }}
        >
          Upload File
        </UploadButton>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Section>
      <Footer />
    </div>
  );
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10vw;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
`;

const Slogan = styled.h1`
  font-size: 80px;
  color: #000000;
  font-weight: bold;
  transform: translateY(-150px);
`;

const UploadButton = styled.button`
  padding: 25px 40px;
  font-size: 35px;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(-80px);
  transition: color 0.3s;

  &:hover {
    color: black;
  }
`;
