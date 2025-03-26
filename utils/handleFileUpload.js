import {
  uploadStudyGuideToFirebase,
  uploadFileToFirebase,
} from "@/firebase/database";
import * as tiktoken from "js-tiktoken";

const handleFileUpload = async (
  file,
  isPublic,
  includeVideos,
  includeExamples,
  includeQuestions,
  includeResources,
  currentUser,
  topicToLearnAbout,
  setLoadingPercentage
) => {
  try {
    setLoadingPercentage([1, "Thinking"]);
    let topicsAndExplanationsResponse;
    let firebaseFileUrl;
    if (file) {
      setLoadingPercentage([10, "Uploading File"]);
      // Upload the file to Firebase Storage
      firebaseFileUrl = await uploadFileToFirebase(file);

      setLoadingPercentage([20, "Extracting Text"]);

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
        let error = await response.text();
        error = await JSON.parse(error);
        if (error.error === "EMPTY_DATA") {
          throw new Error("EMPTY_DATA");
        } else {
          throw new Error(`Error: ${response.status} ${error}`);
        }
      }

      // Get the extracted data as a string
      const extractedData = await response.json();

      // Count the number of tokens in the extractedData (limit on current gpt is 128k input and output combined so setting it to 115k so there is room for response)
      const encoding = tiktoken.getEncoding("o200k_base"); // the input of .get_encoding() will need to be changed when we switch to one of the gpt-o models to "o200k_base"
      // Switch back to cl100k_base when we switch to gpt-4o
      const tokenCheck = encoding.encode(extractedData);
      if (tokenCheck.length > 115000) {
        throw new Error("TOKEN_ERROR");
      }

      setLoadingPercentage([60, "Generating Topics"]);

      // Send extracted data to GPT to retrieve topics + explanations object from data
      topicsAndExplanationsResponse = await fetch("/api/get-topics-gpt", {
        method: "POST",
        body: extractedData,
      });
    } else {
      setLoadingPercentage([60, "Generating topics"]);
      // Send the topic to learn about to GPT to retrieve topics + explanations object from data
      topicsAndExplanationsResponse = await fetch("/api/generate-topics-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicToLearnAbout),
      });
    }

    // Check if topicsAndExplanationsResponse is OK
    if (!topicsAndExplanationsResponse.ok) {
      throw new Error("Failed to fetch topics and summaries");
    }

    // Get the topics and summaries as JSON
    const topicsAndExplanations = await topicsAndExplanationsResponse.json();
    const topics = Object.keys(topicsAndExplanations); // Extracting topics

    setLoadingPercentage([80, "Finding Videos and Resources"]);

    let youtubePromises = [];
    let googleResultsPromise = [];

    const youtubeQueriesPromise = includeVideos
      ? Promise.all(
          topics.map((topic) =>
            fetch("/api/create-youtube-query", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                topic: topic,
                explanation: topicsAndExplanations[topic],
              }),
            }).then((res) => {
              if (!res.ok) {
                throw new Error("Failed to create YouTube query");
              }
              return res.json(); // Return the YouTube query
            })
          )
        )
      : Promise.resolve([]);

    const googleSearchQueriesPromise = includeResources
      ? Promise.all(
          topics.map((topic) =>
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
          )
        )
      : Promise.resolve([]);

    const [youtubeQueries, googleSearchQueriesResponse] = await Promise.all([
      youtubeQueriesPromise,
      googleSearchQueriesPromise,
    ]);

    if (includeVideos) {
      // Create a dictionary mapping query to topic, explanation
      const youtubeQueriesDict = {};
      topics.forEach((topic, index) => {
        youtubeQueriesDict[youtubeQueries[index]] = {
          topic: topic,
          explanation: topicsAndExplanations[topic],
        };
      });

      // Prepare an array of fetch promises for YouTube videos
      youtubePromises = youtubeQueries.map((query) =>
        fetch("/api/get-youtube-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            topic: youtubeQueriesDict[query].topic,
            explanation: youtubeQueriesDict[query].explanation,
          }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch video");
          }
          return res.json(); // Return the video ID
        })
      );
    }

    if (includeResources) {
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

    setLoadingPercentage([93, "Generating Content"]);

    // Resolve all promises concurrently
    const [
      youtubeResponses,
      examplesResponse,
      questionAnswerResponse,
      googleSearchResponse,
    ] = await Promise.all([
      includeVideos ? Promise.all(youtubePromises) : [],
      includeExamples ? createExamplesPromise.then((res) => res.json()) : null,
      includeQuestions
        ? createQuestionAnswerPromise.then((res) => res.json())
        : null,
      includeResources ? Promise.all(googleResultsPromise) : [],
    ]);

    setLoadingPercentage([100, "Finishing Up"]);

    // At this point, YouTube responses should be an array of arrays
    // Filter out any duplicates
    const seen = new Set();
    const filteredYoutubeResponses = youtubeResponses.map((sublist) => {
      if (!sublist || !Array.isArray(sublist)) {
        return [];
      }
      const filteredSublist = [];
      sublist.forEach((num) => {
        if (!seen.has(num)) {
          filteredSublist.push(num);
          seen.add(num);
        }
      });
      return filteredSublist;
    });

    // Wait for both the YouTube video and create content fetches to complete
    let filteredGoogleSearchResults;
    if (includeResources) {
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
        youtubeIds: filteredYoutubeResponses
          ? filteredYoutubeResponses[index]
          : [],
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
      fileName: file ? file.name : topicToLearnAbout,
      extractedData: JSON.stringify(combinedResponse),
      topics: topics,
      hiddenExplanations: JSON.stringify(topicsAndExplanationsObject),
      googleSearchResults: filteredGoogleSearchResults
        ? JSON.stringify(filteredGoogleSearchResults)
        : JSON.stringify([]),
      firebaseFileUrl: file ? firebaseFileUrl : null,
      createdAt: new Date(),
      lastModified: new Date(),
      createdBy: currentUser.uid,
      contributors: [currentUser.uid],
      editors: [currentUser.uid],
      isPublic: isPublic,
      gotFromPublic: false,
    };

    setLoadingPercentage([100, "Done!"]);

    // Conditionally add googleSearchResults to studyGuide
    const studyGuideId = await uploadStudyGuideToFirebase(studyGuide);

    // Return the study guide ID if successful
    return studyGuideId;
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error == "Error: TOKEN_ERROR") {
      return "TOKEN_ERROR";
    } else if (error == "Error: EMPTY_DATA") {
      return "EMPTY_DATA";
    } else {
      return "UNKNOWN_ERROR";
    }
  }
};

export { handleFileUpload };
