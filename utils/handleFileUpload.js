import { uploadStudyGuideToFirebase } from "@/firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";

const handleFileUpload = async (event, currentUser, hasSpark) => {
  if (!hasSpark) {
    return { studyGuideId: null, error: "noSubscription" };
  }
  const file = event.target.files[0];
  if (file) {
    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Start with extracting data from the form
      const response = await fetch("/api/extract-text", {
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

      // If everything was successful up to this point, then upload the file to Firebase Storage
      const uniqueId = uuidv4();
      const uniqueFileName = `${uniqueId}_${file.name}`;

      const storageRef = ref(storage, `uploads/${uniqueFileName}`);
      let firebaseFileUrl = "";
      try {
        await uploadBytes(storageRef, file);
        firebaseFileUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      // Upload extractedData, googleSearchResults, and firebaseFileUrl to Firestore
      // Use a Firestore transaction to ensure atomicity
      let studyGuide = {
        fileName: file.name,
        extractedData: JSON.stringify(combinedResponse),
        googleSearchResults: JSON.stringify(googleSearchResults),
        firebaseFileUrl: firebaseFileUrl,
        createdAt: new Date(),
        createdBy: currentUser.uid,
        contributors: [currentUser.uid],
        editors: [currentUser.uid],
      };
      const studyGuideId = await uploadStudyGuideToFirebase(studyGuide);

      // Return the study guide ID if successful
      return { studyGuideId, error: null };
    } catch (error) {
      console.error("Error uploading file:", error);
      // Check if error type is invalidFileType
      if (error.message.includes("invalidFileType")) {
        return { studyGuideId: null, error: "invalidFileType" };
      }
    }
  }
};

export { handleFileUpload };
