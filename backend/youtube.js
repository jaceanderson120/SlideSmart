import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export async function getYoutubeVideo(topic) {
  const apiServiceName = "youtube";
  const apiVersion = "v3";
  const DEVELOPER_KEY = process.env.YOUTUBE_API_KEY;

  const youtube = google.youtube({
    version: apiVersion,
    auth: DEVELOPER_KEY,
  });

  return new Promise((resolve, reject) => {
    youtube.search.list(
      {
        part: "snippet",
        q: topic,
        type: "video",
        maxResults: 1,
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          const videoIds = response.data.items.map((item) => item.id.videoId);
          resolve(videoIds);
        }
      }
    );
  });
}
