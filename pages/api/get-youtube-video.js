import { google } from "googleapis";
import dotenv from "dotenv";
import { AzureOpenAI } from "openai";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

// This function determines which videos are actually relevant to the topic
// Input: Dictionary mapping video IDs to video titles
//        Topic to filter by (string)
//        Explanation to filter by (string)
// Output: Array of video IDs that are relevant to the topic
const filterRelevantVideos = async (videos, topic, explanation) => {
  const prompt = `Given the topic "${topic}" and the explanation "${explanation}", determine which videos are most relevant to the topic and explanation.
  Here is a dictionary mapping video IDs to video titles: ${JSON.stringify(
    videos
  )}
  Return a JSON object of the video IDs that are relevant to the topic and explanation.
  The form of the JSON object should be: { "relevantVideos": ["videoId1", "videoId2", ...] }.`;

  try {
    const completion = await openai.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at determining relevant videos given a topic and explanation. You respond to prompts with JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const relevantVideos = JSON.parse(completion.choices[0].message.content);
    return relevantVideos.relevantVideos ? relevantVideos.relevantVideos : [];
  } catch (error) {
    console.error("Error determining relevant videos:", error);
    return [];
  }
};

// Custom metric function to score videos
const calculateVideoScore = (video) => {
  const likeCount = parseInt(video.statistics.likeCount, 10);
  const viewCount = parseInt(video.statistics.viewCount, 10);
  const commentCount = parseInt(video.statistics.commentCount, 10);

  if (viewCount === 0) {
    return 0;
  }

  const likeScore = likeCount / viewCount; // Likes per view
  const commentScore = commentCount / viewCount; // Comments per view
  const viewScore = Math.log10(viewCount + 1); // Normalize view count

  // Weights
  const weightLikes = 0.3;
  const weightComments = 0.2;
  const weightViews = 0.5;

  // Calculate engagement score
  const engagementScore =
    likeScore * weightLikes +
    commentScore * weightComments +
    viewScore * weightViews;

  return engagementScore;
};

export default async function getYoutubeVideo(req, res) {
  const apiVersion = "v3";
  const DEVELOPER_KEY = process.env.YOUTUBE_API_KEY;

  // Get the query from the request body or query parameters
  const { query, topic, explanation } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const youtube = google.youtube({
    version: apiVersion,
    auth: DEVELOPER_KEY,
  });

  try {
    // Search for medium videos (4 to 20 minutes)
    const videosResponse = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 7,
      videoDuration: "medium", // between 4 to 20 minutes
    });

    // Combine the results from the search
    const combinedVideos = [...videosResponse.data.items];

    const videoIds = combinedVideos.map((item) => item.id.videoId);

    // Fetch additional video details to filter by like/dislike ratio and embed status
    const videoDetailsResponse = await youtube.videos.list({
      part: "statistics,player,status,snippet",
      id: videoIds.join(","),
    });

    // Filter out videos with less than 10,000 views and that allow embedding
    const filteredVideos = videoDetailsResponse.data.items.filter(
      (item) =>
        parseInt(item.statistics.viewCount, 10) >= 10000 &&
        item.player.embedHtml !== undefined && // Check if the video allows embedding
        item.status.embeddable === true
    );

    // Create a dictionary mapping video IDs to video titles
    const videoTitles = {};
    for (const video of filteredVideos) {
      videoTitles[video.id] = video.snippet.title;
    }

    // Check if the videos are relevant to the topic and explanation
    const relevantVideoIds = await filterRelevantVideos(
      videoTitles,
      topic,
      explanation
    );

    // Filter out videos that are not relevant to the topic and explanation
    const relevantVideos = filteredVideos.filter((video) =>
      relevantVideoIds.includes(video.id)
    );

    // Sometimes all videos are filtered out, just return the video with the most views as a fallback
    if (filteredVideos.length === 0) {
      let mostViewedVideo;
      for (const video of videoDetailsResponse.data.items) {
        if (
          !mostViewedVideo ||
          video.statistics.viewCount > mostViewedVideo.statistics.viewCount
        ) {
          mostViewedVideo = video;
        }
      }
      if (mostViewedVideo) {
        res.json([mostViewedVideo.id]);
      }
    }

    // Calculate scores for the remaining relevant videos
    const scoredVideos = relevantVideos
      .map((item) => ({
        id: item.id,
        score: calculateVideoScore(item),
      }))
      .sort((a, b) => b.score - a.score);

    // Get the video IDs of the videos with the top 5 best scores
    const bestVideos =
      scoredVideos.length > 0
        ? scoredVideos.slice(0, 3).map((video) => video.id)
        : null;

    // Send the best video ID back to the client
    console.log("Best videos:", bestVideos);
    res.json(bestVideos);
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    res.status(500).json({ error: error.message });
  }
}
