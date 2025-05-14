import { useState } from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight, RotateCcw, X } from "lucide-react";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import IconButton from "@/components/IconButton";

const useVideoManagement = (studyGuide, topic, hasSpark) => {
  const [videoIndex, setVideoIndex] = useState(0);
  const [findingNewYoutubeVideo, setFindingNewYoutubeVideo] = useState(false);
  const [topicForNewYoutubeVideo, setTopicForNewYoutubeVideo] = useState(null);
  const [isNewYoutubeVideoDialogOpen, setIsNewYoutubeVideoDialogOpen] =
    useState(false);

  const goToPreviousVideo = () => {
    if (videoIndex > 0) {
      setVideoIndex((prev) => prev - 1);
    } else {
      setVideoIndex(studyGuide.extractedData[topic]["youtubeIds"].length - 1);
    }
  };

  const goToNextVideo = () => {
    if (videoIndex < studyGuide.extractedData[topic]["youtubeIds"].length - 1) {
      setVideoIndex((prev) => prev + 1);
    } else {
      setVideoIndex(0);
    }
  };

  const getNewYoutubeVideo = async () => {
    if (!hasSpark) {
      toast.error("You need to have a Spark subscription to use this feature.");
      return;
    }

    setFindingNewYoutubeVideo(true);
    setTopicForNewYoutubeVideo(topic);

    try {
      const filteredData = {
        topic: topic,
        explanation: studyGuide.extractedData[topic]?.explanation,
      };

      const res = await fetch("/api/create-youtube-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredData),
      });
      const query = await res.json();

      const res2 = await fetch("/api/get-youtube-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          topic: topic,
          explanation: studyGuide.extractedData[topic]?.explanation,
        }),
      });
      let videoIds = (await res2.json()) || [];

      if (videoIds.length > 0) {
        let allVideoIds = [];
        Object.keys(studyGuide.extractedData).forEach((key) => {
          allVideoIds = allVideoIds.concat(
            studyGuide.extractedData[key]["youtubeIds"]
          );
        });

        let filteredVideoIds = [];
        for (const video of videoIds) {
          if (!allVideoIds.includes(video)) {
            filteredVideoIds.push(video);
          }
        }

        videoIds = filteredVideoIds;

        setVideoIndex(0);

        // Update the study guide with new video IDs
        studyGuide.extractedData[topic]["youtubeIds"] = videoIds;
      } else {
        toast.error(
          "Sorry, couldn't find a new YouTube video for you. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching new videos. Please try again."
      );
    } finally {
      setFindingNewYoutubeVideo(false);
      setTopicForNewYoutubeVideo(null);
    }
  };

  return {
    videoIndex,
    findingNewYoutubeVideo,
    topicForNewYoutubeVideo,
    isNewYoutubeVideoDialogOpen,
    setIsNewYoutubeVideoDialogOpen,
    goToPreviousVideo,
    goToNextVideo,
    getNewYoutubeVideo,
  };
};

const Video = ({
  topic,
  studyGuide,
  editMode,
  hasSpark,
  setTopicToDelete,
  setSectionToDelete,
  setIsDeleteSectionDialogOpen,
}) => {
  const {
    videoIndex,
    findingNewYoutubeVideo,
    topicForNewYoutubeVideo,
    isNewYoutubeVideoDialogOpen,
    setIsNewYoutubeVideoDialogOpen,
    goToPreviousVideo,
    goToNextVideo,
    getNewYoutubeVideo,
  } = useVideoManagement(studyGuide, topic, hasSpark);

  const handleDeleteVideo = () => {
    setTopicToDelete(topic);
    setSectionToDelete("youtubeIds");
    setIsDeleteSectionDialogOpen(true);
  };

  return (
    <>
      <VideoContainer>
        {topicForNewYoutubeVideo === topic && findingNewYoutubeVideo ? (
          <Dots />
        ) : studyGuide.extractedData[topic]["youtubeIds"]?.length > 0 ? (
          <VideoContentContainer>
            <IframeContainer>
              <iframe
                src={`https://www.youtube.com/embed/${
                  studyGuide.extractedData[topic]["youtubeIds"][
                    isNaN(videoIndex) ||
                    videoIndex >=
                      studyGuide.extractedData[topic]["youtubeIds"].length
                      ? 1
                      : videoIndex
                  ]
                }`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </IframeContainer>
            <SwitchVideoContainer>
              <IconButton
                icon={<ArrowLeft size={20} />}
                onClick={goToPreviousVideo}
                title="Previous Video"
              />
              <span>
                {isNaN(videoIndex) ? 1 : videoIndex + 1} of{" "}
                {studyGuide.extractedData[topic]["youtubeIds"].length}
              </span>
              <IconButton
                icon={<ArrowRight size={20} />}
                onClick={goToNextVideo}
                title="Next Video"
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                {editMode && (
                  <>
                    <IconButton
                      icon={<RotateCcw size={20} />}
                      onClick={() => setIsNewYoutubeVideoDialogOpen(true)}
                      title="Find New Videos"
                    />
                    <IconButton
                      icon={<X size={20} />}
                      onClick={handleDeleteVideo}
                      title="Delete Video"
                    />
                  </>
                )}
              </div>
            </SwitchVideoContainer>
          </VideoContentContainer>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <NoVideoText>
              We found the best videos for you, but they are already in this
              study guide. If you believe there are better videos, feel free to
              try to generate new ones. If not, you can delete this section in
              edit mode!
            </NoVideoText>
            {editMode && (
              <>
                <IconButton
                  icon={<RotateCcw size={20} />}
                  onClick={() => setIsNewYoutubeVideoDialogOpen(true)}
                  title="Find New Videos"
                />
                <IconButton
                  icon={<X size={20} />}
                  onClick={handleDeleteVideo}
                  title="Delete Video"
                />
              </>
            )}
          </div>
        )}
      </VideoContainer>
      <ConfirmationModal
        isOpen={isNewYoutubeVideoDialogOpen}
        onClose={() => setIsNewYoutubeVideoDialogOpen(false)}
        title="Find More Videos"
        text={`SolaSlides uses AI and complex algorithms to analyze your topic explanation and find the best YouTube videos to help you learn.\n\nIf the same videos appear after regenerating videos, it is because they are the best videos for your explanation.\n\nPlease confirm that your topic explanation reflects what you wish to learn.`}
        onConfirm={() => {
          setIsNewYoutubeVideoDialogOpen(false);
          getNewYoutubeVideo();
        }}
      />
    </>
  );
};

export default Video;

const VideoContainer = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.label};
  text-align: left;
  margin-bottom: 16px;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
`;

const VideoContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const SwitchVideoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.fontSize.label};
`;

const IframeContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 16 / 9;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const NoVideoText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
  font-style: italic;
  color: ${({ theme }) => theme.black};
  padding: 8px;
`;
