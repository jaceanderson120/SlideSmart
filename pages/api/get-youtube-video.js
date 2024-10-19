import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export default async function getYoutubeVideo(req, res) {
  const apiServiceName = "youtube";
  const apiVersion = "v3";
  const DEVELOPER_KEY = process.env.YOUTUBE_API_KEY;

  // Get the topic from the request body or query parameters
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const youtube = google.youtube({
    version: apiVersion,
    auth: DEVELOPER_KEY,
  });

  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: topic,
      type: "video",
      maxResults: 1,
    });

    const videoIds = response.data.items.map((item) => item.id.videoId);

    // Send the video IDs back to the client
    res.json(videoIds);
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    res.status(500).json({ error: error.message });
  }
}
