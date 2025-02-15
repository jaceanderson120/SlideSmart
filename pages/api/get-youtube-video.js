import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

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
  const apiServiceName = "youtube";
  const apiVersion = "v3";
  const DEVELOPER_KEY = process.env.YOUTUBE_API_KEY;

  // Get the query from the request body or query parameters
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const youtube = google.youtube({
    version: apiVersion,
    auth: DEVELOPER_KEY,
  });

  try {
    // Search for short videos
    const shortVideosResponse = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 10,
      videoDuration: "short", // less than 4 minutes
    });

    // Search for medium videos (4 to 20 minutes)
    const mediumVideosResponse = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 10,
      videoDuration: "medium", // between 4 to 20 minutes
    });

    // Combine the results from both searches
    const combinedVideos = [
      ...shortVideosResponse.data.items,
      ...mediumVideosResponse.data.items,
    ];

    const videoIds = combinedVideos.map((item) => item.id.videoId);

    // Fetch additional video details to filter by like/dislike ratio and embed status
    const videoDetailsResponse = await youtube.videos.list({
      part: "statistics,player",
      id: videoIds.join(","),
    });

    // Filter out videos with less than 10,000 views and that allow embedding
    const filteredVideos = videoDetailsResponse.data.items.filter(
      (item) =>
        parseInt(item.statistics.viewCount, 10) >= 10000 &&
        item.player.embedHtml !== undefined // Check if the video allows embedding
    );

    // Calculate scores for the remaining videos
    const scoredVideos = filteredVideos
      .map((item) => ({
        id: item.id,
        score: calculateVideoScore(item),
      }))
      .sort((a, b) => b.score - a.score);

    // Get the video IDs of the videos with the top 5 best scores
    const bestVideos =
      scoredVideos.length > 0
        ? scoredVideos.slice(0, 5).map((video) => video.id)
        : null;

    // Send the best video ID back to the client
    res.json(bestVideos);
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    res.status(500).json({ error: error.message });
  }
}
