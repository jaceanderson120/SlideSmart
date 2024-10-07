import os
from dotenv import load_dotenv
import googleapiclient.discovery

# Load environment variables from .env file
load_dotenv('@/.env')

def get_youtube_video(topic):
    api_service_name = "youtube"
    api_version = "v3"
    DEVELOPER_KEY = os.getenv("YOUTUBE_API_KEY")

    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey = DEVELOPER_KEY)

    request = youtube.search().list(
        part="snippet",
        q=topic,
        type="video",
        maxResults=1
    )
    
    response = request.execute()

    video_ids = []
    for item in response.get('items', []):
        video_id = item['id']['videoId']
        video_ids.append(video_id)

    return video_ids