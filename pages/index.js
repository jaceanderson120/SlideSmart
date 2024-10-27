import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingOverlay from "../components/Overlay";
import { useStateContext } from "@/context/StateContext";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const {isLoggedIn} = useStateContext();

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

        setLoadingPercentage(getRandomInRange(5, 15));
        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} ${errorText}`);
        }
        setLoadingPercentage(getRandomInRange(16, 37));

        // Get the extracted data as a string
        const extractedData = await response.json();

        setLoadingPercentage(getRandomInRange(38, 49));

        // Send extracted data to GPT to retrieve topics + summaries object from data
        const topicsAndSummariesResponse = await fetch("/api/get-topics-gpt", {
          method: "POST",
          body: extractedData,
        });

        setLoadingPercentage(getRandomInRange(50, 63));

        // Check if topicsAndSummariesResponse is OK
        if (!topicsAndSummariesResponse.ok) {
          throw new Error("Failed to fetch topics and summaries");
        }

        // Get the topics and summaries as JSON
        const topicsAndSummaries = await topicsAndSummariesResponse.json();
        const topics = Object.keys(topicsAndSummaries["topics"]); // Extracting topics
        const googleSearchQuery = topicsAndSummaries["googleSearchQuery"]; // Extracting Google search query

        // Get the YouTube search queries for each topic
        const queries = topics.map(
          (topic) => topicsAndSummaries["topics"][topic][1]
        );

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
          body: JSON.stringify(topicsAndSummaries["topics"]),
        });

        // Prepare the fetch for the Google search query
        const googleSearchQueryPromise = fetch("/api/search-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: googleSearchQuery }),
        });

        // Wait for both the YouTube video and create content fetches to complete
        const [youtubeResponses, createdContentResponse, googleSearchResponse] =
          await Promise.all([
            Promise.all(youtubePromises), // Resolve all YouTube video fetches
            createContentPromise, // Resolve create content fetch
            googleSearchQueryPromise, // Resolve Google search query fetch
          ]);

        const googleSearchResults = await googleSearchResponse.json();

        setLoadingPercentage(getRandomInRange(64, 84));

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
            summary: topicsAndSummaries["topics"][topic][0],
            question: createdContent[topic]?.question || "",
            answer: createdContent[topic]?.answer || "",
            youtubeId: youtubeResponses[index],
          };
        });

        setLoadingPercentage(getRandomInRange(85, 100));
        setIsLoading(false);

        // Redirect to the study page with extracted data
        router.push({
          pathname: "/study",
          query: {
            extractedData: JSON.stringify(combinedResponse),
            googleSearchResults: JSON.stringify(googleSearchResults),
          },
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
          {isLoggedIn ? "Upload File" : "Login to Upload File"}
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
