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

      // Send extracted data to GPT to retrieve topics + explanations object from data
      const topicsAndExplanationsResponse = await fetch("/api/get-topics-gpt", {
        method: "POST",
        body: extractedData,
      });

      // Check if topicsAndExplanationsResponse is OK
      if (!topicsAndExplanationsResponse.ok) {
        throw new Error("Failed to fetch topics and summaries");
      }

      // Get the topics and summaries as JSON
      const topicsAndExplanations = await topicsAndExplanationsResponse.json();
      const topics = Object.keys(topicsAndExplanations); // Extracting topics

      // Generate a promise to get a YouTube video query for each topic
      const queries = topics.map((topic) =>
        fetch("/api/create-youtube-query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topicsAndExplanations[topic]),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create YouTube query");
          }
          return res.json(); // Return the YouTube query
        })
      );

      // Resolve all YouTube video queries
      const youtubeQueries = await Promise.all(queries);

      // Prepare an array of fetch promises for YouTube videos
      const youtubePromises = youtubeQueries.map((query) =>
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

      // Generate a practice question and answer for each topic
      const createContentPromise = fetch("/api/create-question-answer-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicsAndExplanations),
      });

      // Prepare the fetch for getting examples
      const createExamplesPromise = fetch("/api/create-examples-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicsAndExplanations),
      });

      // Generate a Google search query for each topic
      const googleSearchQueries = topics.map((topic) =>
        fetch("/api/create-google-query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topicsAndExplanations[topic]),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create Google query");
          }
          return res.json(); // Return the Google query
        })
      );

      // Resolve all Google search queries
      const googleSearchQueriesResponse = await Promise.all(
        googleSearchQueries
      );

      // Prepare the fetch for the Google search query
      const googleResultsPromise = googleSearchQueriesResponse.map((query) =>
        fetch("/api/search-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch Google search results");
          }
          return res.json(); // Return the google search results
        })
      );

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
        Promise.all(googleResultsPromise), // Resolve Google search query fetch
      ]);

      // Create array of Google search results
      let googleSearchResults = googleSearchResponse.map((result) => {
        if (!result.error) {
          return {
            title: result.title,
            link: result.link,
            snippet: result.snippet,
          };
        } else {
          return null;
        }
      });

      // Filter null values from googleSearchResults
      const filteredGoogleSearchResults = googleSearchResults.filter(
        (result) => result !== null
      );

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
          explanation: topicsAndExplanations[topic],
          question: createdContent[topic]?.question || "",
          answer: createdContent[topic]?.answer || "",
          example: createdExampleContent[topic] || "",
          youtubeIds: youtubeResponses[index] || [],
        };
      });

      // Upload extractedData, googleSearchResults, and firebaseFileUrl to Firestore
      // Use a Firestore transaction to ensure atomicity
      let studyGuide = {
        fileName: file.name,
        extractedData: JSON.stringify(combinedResponse),
        googleSearchResults: JSON.stringify(filteredGoogleSearchResults),
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
