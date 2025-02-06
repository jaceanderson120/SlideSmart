import {
  uploadStudyGuideToFirebase,
  uploadFileToFirebase,
} from "@/firebase/database";

const handleFileUpload = async (
  file,
  isPublic,
  includeVideos,
  includeExamples,
  includeQuestions,
  includeResources,
  currentUser
) => {
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

      let youtubePromises = [];
      if (includeVideos) {
        // Generate a promise to get a YouTube video query for each topic
        const queries = topics.map((topic) =>
          fetch("/api/create-youtube-query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: topic,
              data: topicsAndExplanations[topic],
            }),
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
        youtubePromises = youtubeQueries.map((query) =>
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
      }

      // Generate a practice question and answer for each topic
      let createQuestionAnswerPromise;
      if (includeQuestions) {
        // Prepare the fetch for creating question and answer
        createQuestionAnswerPromise = fetch("/api/create-question-answer-gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topicsAndExplanations),
        });
      }

      let createExamplesPromise;
      if (includeExamples) {
        // Prepare the fetch for getting examples
        createExamplesPromise = fetch("/api/create-examples-gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topicsAndExplanations),
        });
      }

      let googleResultsPromise;
      if (includeResources) {
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
        googleResultsPromise = googleSearchQueriesResponse.map((query) =>
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
      }

      // Only resolve youtubePromises if includeVideos is true
      let youtubeResponses = [];
      if (includeVideos) {
        youtubeResponses = await Promise.all(youtubePromises);
      }

      // Only resolve createExamplesPromise if includeExamples is true
      let examplesResponse;
      if (includeExamples) {
        examplesResponse = await createExamplesPromise;
        // Convert the examplesResponse to JSON
        examplesResponse = await examplesResponse.json();
      }

      // Only resolve createQuestionAnswerPromise if includeQuestions is true
      let questionAnswerResponse;
      if (includeQuestions) {
        questionAnswerResponse = await createQuestionAnswerPromise;
        // Convert the createQuestionAnswerPromise to JSON
        questionAnswerResponse = await questionAnswerResponse.json();
      }

      // Wait for both the YouTube video and create content fetches to complete
      let filteredGoogleSearchResults;
      if (includeResources) {
        const googleSearchResponse = await Promise.all(googleResultsPromise); // Resolve Google search query fetch

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
        filteredGoogleSearchResults = googleSearchResults.filter(
          (result) => result !== null
        );
      }

      // Combine the responses into one object
      const combinedResponse = {};
      topics.forEach((topic, index) => {
        combinedResponse[topic] = {
          explanation: topicsAndExplanations[topic],
          youtubeIds: youtubeResponses ? youtubeResponses[index] : [],
        };

        // Conditionally add the example field if it exists
        if (includeExamples) {
          combinedResponse[topic].example = examplesResponse[topic];
        }

        // Conditionally add the question and answer field if it exists
        if (includeQuestions) {
          combinedResponse[topic].question =
            questionAnswerResponse[topic].question;
          combinedResponse[topic].answer = questionAnswerResponse[topic].answer;
        }
      });

      // Create an object of {"topic": "explanation"} pairs
      const topicsAndExplanationsObject = {};
      topics.forEach((topic) => {
        topicsAndExplanationsObject[topic] = topicsAndExplanations[topic];
      });

      // Upload extractedData, googleSearchResults, and firebaseFileUrl to Firestore
      // Use a Firestore transaction to ensure atomicity
      let studyGuide = {
        fileName: file.name,
        extractedData: JSON.stringify(combinedResponse),
        topics: topics,
        hiddenExplanations: JSON.stringify(topicsAndExplanationsObject),
        googleSearchResults: filteredGoogleSearchResults
          ? JSON.stringify(filteredGoogleSearchResults)
          : JSON.stringify([]),
        firebaseFileUrl: firebaseFileUrl,
        createdAt: new Date(),
        lastModified: new Date(),
        createdBy: currentUser.uid,
        contributors: [currentUser.uid],
        editors: [currentUser.uid],
        isPublic: isPublic,
        gotFromPublic: false,
      };

      // Conditionally add googleSearchResults to studyGuide
      const studyGuideId = await uploadStudyGuideToFirebase(studyGuide);

      // Return the study guide ID if successful
      return studyGuideId;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};

export { handleFileUpload };
