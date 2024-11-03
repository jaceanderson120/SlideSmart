import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../library/firebase/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const { isLoggedIn } = useStateContext();

  const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to handle the button click and open the file selector
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClick = () => {
    if (isLoggedIn) {
      handleUploadClick();
    } else {
      router.push("/login");
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
        const response = await fetch("/api/extract-text", {
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

        // Prepare the fetch for getting examples
        const createExamplesPromise = fetch("/api/create-examples-gpt", {
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
        const [
          youtubeResponses,
          createdContentResponse,
          createdExampleResponse,
          googleSearchResponse,
        ] = await Promise.all([
          Promise.all(youtubePromises), // Resolve all YouTube video fetches
          createContentPromise, // Resolve create content fetch
          createExamplesPromise, // Resolve examples promise
          googleSearchQueryPromise, // Resolve Google search query fetch
        ]);

        const googleSearchResults = await googleSearchResponse.json();

        setLoadingPercentage(getRandomInRange(64, 84));

        // Check if createdContentResponse is OK
        if (!createdContentResponse.ok) {
          throw new Error("Failed to create content");
        }

        // Check if created examples is ok
        if (!createdExampleResponse.ok) {
          throw new Error("Failed to create examples");
        }

        // Get the created content as JSON
        const createdContent = await createdContentResponse.json();

        const createdExampleContent = await createdExampleResponse.json();

        // Combine the responses into one object
        const combinedResponse = {};
        topics.forEach((topic, index) => {
          combinedResponse[topic] = {
            summary: topicsAndSummaries["topics"][topic][0],
            question: createdContent[topic]?.question || "",
            answer: createdContent[topic]?.answer || "",
            example: createdExampleContent[topic]?.example || "",
            youtubeId: youtubeResponses[index],
          };
        });

        setLoadingPercentage(getRandomInRange(85, 100));

        // If everything was successful up to this point, then upload the file to Firebase Storage
        const storageRef = ref(storage, `uploads/${file.name}`);
        let firebaseFileUrl = "";
        try {
          await uploadBytes(storageRef, file);
          firebaseFileUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error("Error uploading file:", error);
        }

        setIsLoading(false);

        // Redirect to the study page with extracted data, google search results, and firebase file URL
        router.push({
          pathname: "/study",
          query: {
            extractedData: JSON.stringify(combinedResponse),
            googleSearchResults: JSON.stringify(googleSearchResults),
            firebaseFileUrl: firebaseFileUrl,
          },
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <>
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
      <GradientSection>
        <GradientSectionSlogan>
          The AI Application Made
          <SloganBreakLine />
          to Make
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>
            {" "}
            Slides
          </span>{" "}
          Make Sense
        </GradientSectionSlogan>
        <p style={{ fontSize: "18px", marginTop: "20px", fontWeight: "500" }}>
          A software tool that creates comprehensive/interactive Study Guides
          equipped{" "}
        </p>
        <MakeBetterButton onClick={handleClick}>
          {isLoggedIn ? "Make it Better" : "Get Started"}
        </MakeBetterButton>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </GradientSection>
      <Section>
        <HowItWorksSection>
          <HowItWorksSlogan>It's simple</HowItWorksSlogan>
          <p style={{ fontSize: "18px", marginTop: "10px", fontWeight: "500" }}>
            How to enhance your slides in less than 1 minute
          </p>
          <HowItWorksBoxSection>
            <HowItWorksBoxDivider>
              <HowItWorksBox><LoginIcon>Login</LoginIcon><RegisterIcon>Register</RegisterIcon></HowItWorksBox>
              <Caption>Login or Register an Account</Caption>
              <Captionv2>Click Login or Register in the top right of the page and enter your account details</Captionv2>
            </HowItWorksBoxDivider>
            <HowItWorksBoxDivider>
              <HowItWorksBox><img src = "https://i.imgur.com/9tCP71d.png" alt ="Upload File" style = {{width: "100%", height: "auto"}}></img></HowItWorksBox>
              <Caption>Upload Your Slides</Caption>
              <Captionv2>Upload your .ppt or .pdf file by using the Upload File button</Captionv2>
            </HowItWorksBoxDivider>
            <HowItWorksBoxDivider>
              <HowItWorksBox><img src = "https://i.imgur.com/6l1zlVv.png" style = {{width: "100%", height: "auto", borderRadius: "5px"
              }}></img></HowItWorksBox>
              <Caption>Watch the Magic Happen!</Caption>
              <Captionv2>We generate a Study Guide for you divided by topic best suited to help you succeed</Captionv2>
            </HowItWorksBoxDivider>
          </HowItWorksBoxSection>
        </HowItWorksSection>
      </Section>
      <Footer />
    </>
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

const RegisterIcon = styled.div`
  color: white;
  transition: color 0.3s;
  font-size: 25px;
  font-weight: bold;
  border-radius: 8px;
  background-color: #f03a47;
  padding: 6px;
  border: 2px solid #f03a47;
  padding: 8px;
`

const LoginIcon = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-right: 20px;
`
const GradientSection = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #ff6c7633, #fff0f0cc, #ff6c7633);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 96px;
  text-align: center;
  font-size: 2rem;
`;

const HowItWorksSection = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
  background-color: #f6f4f3;
`;

const HowItWorksSlogan = styled.h1`
  font-size: 48px;
  color: #000000;
  font-weight: bold;
`;

const HowItWorksBoxSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 48px;
`;

const HowItWorksBox = styled.div`
  width: 360px;
  height: 256px;
  background-color: #f5f9ff;
  border: 1px dashed #000000;
  border-radius: 20px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
  justify-content: center;
  
`;

const HowItWorksBoxDivider = styled.div`
  display: flex;
  margin-left: 50px;
  margin-right: 50px;
  align-items: flex-start;
  flex-direction: column;
`;

const Caption = styled.p`
  font-size: 25px;
  margin-top: 16px;
  font-weight: bold;
  text-align: left;
`;

const Captionv2 = styled.p`
  font-size: 20px;
  text-align: left;
  margin-top: 10px;
`

const GradientSectionSlogan = styled.h1`
  font-size: 60px;
  color: #000000;
  font-weight: bold;
  margin-top: 100px;
`;

const SloganBreakLine = styled.div`
  margin: 10px;
`;

const MakeBetterButton = styled.button`
  padding: 25px 30px;
  font-size: 35px;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s;
  margin-top: 40px;

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
