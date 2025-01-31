import {
  uploadStudyGuideToFirebase,
  uploadFileToFirebase,
} from "@/firebase/database";

const handleFileUpload = async (file, isPublic, currentUser) => {
  if (file) {
    try {
      // Upload the file to Firebase Storage
      const firebaseFileUrl = await uploadFileToFirebase(file);

      // Start with extracting data from the form
      const response = await fetch("/api/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl: firebaseFileUrl }),
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
          youtubeIds: youtubeResponses[index],
        };
      });

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
        isPublic: isPublic,
        gotFromPublic: false,
      };
      const studyGuideId = await uploadStudyGuideToFirebase(studyGuide);

      // Return the study guide ID if successful
      return studyGuideId;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};

export { handleFileUpload };
