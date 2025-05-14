import {
  updateStudyGuideExtractedData,
  updateStudyGuideHiddenExplanations,
} from "@/firebase/database";
import {
  generateExample,
  generateExplanation,
  generateQuestionAnswer,
} from "@/utils/generateStudyGuideSections";
import { useState } from "react";
import { toast } from "react-toastify";

const useEditor = (studyGuide, setStudyGuide) => {
  const [editMode, setEditMode] = useState(false);
  const [initialStudyGuide, setInitialStudyGuide] = useState(studyGuide);

  // Save the extracted data to Firestore when the user changes it
  const updateStudyGuideOnFirestore = () => {
    if (studyGuide) {
      // Ensure that the extracted data is a string before saving it to Firestore
      const extractedData = JSON.stringify(studyGuide.extractedData);
      updateStudyGuideExtractedData(studyGuide.id, extractedData);

      // Save the hidden explanations to Firestore
      const hiddenExplanations = JSON.stringify(studyGuide.hiddenExplanations);
      updateStudyGuideHiddenExplanations(studyGuide.id, hiddenExplanations);
    }
  };

  // Function to update the study guide object with the new value
  const updateStudyGuideObject = (topic, key, value) => {
    setStudyGuide((prev) => {
      const updatedData = {
        ...prev,
        extractedData: {
          ...prev.extractedData,
          [topic]: {
            ...prev.extractedData[topic],
            [key]: value,
          },
        },
      };
      return updatedData;
    });
  };

  // Function to handle when the user clicks the edit mode option in the menu
  const handleEditClicked = () => {
    if (editMode) {
      // Save the extracted data and hidden explanantions to Firestore when the user changes it
      updateStudyGuideOnFirestore();
      toast.info("Your changes have been saved successfully!");
    } else {
      // Doing this ensures that initialStudyGuide and studyGuide point to different objects in memory
      // This is called a deep copy
      setInitialStudyGuide(JSON.parse(JSON.stringify(studyGuide)));
      toast.info(
        "Edit mode enabled. You can now edit the study guide. Don't forget to save your changes!"
      );
    }
    setEditMode(!editMode);
  };

  // Function to handle discarding edits
  const discardEdits = () => {
    setStudyGuide({ ...initialStudyGuide });
    setEditMode(false);
    toast.info("Edits have been discarded!");
  };

  // Function to delete a sub section of a topic in the study guide
  const handleDeleteSection = (topic, section) => {
    if (section === "question") {
      const updatedData = { ...studyGuide };
      delete updatedData.extractedData[topic]["question"];
      delete updatedData.extractedData[topic]["answer"];
      setStudyGuide(updatedData);
    } else {
      const updatedData = { ...studyGuide };
      delete updatedData.extractedData[topic][section];
      setStudyGuide(updatedData);
    }
  };

  // Function to delete a topic from the study guide
  const handleTopicDelete = (topic) => {
    // Update the study guide extracted data and hidden explanations to remove the topic
    const updatedData = { ...studyGuide };
    delete updatedData.extractedData[topic];
    delete updatedData.hiddenExplanations[topic];

    setStudyGuide(updatedData);
  };

  // Function to add a new topic to the study guide
  const handleAddTopic = (topicName, explanation, autoToggle = false) => {
    if (studyGuide.extractedData[topicName]) {
      toast.error("Topic already exists. Please choose a different name.");
      return;
    } else if (topicName.length < 1) {
      toast.error("Topic name cannot be empty. Please enter a valid name.");
      return;
    }

    const hiddenExplanations = {
      ...studyGuide.hiddenExplanations,
      [topicName]: explanation,
    };

    // Update the study guide with the new topic
    setStudyGuide((prev) => {
      const updatedData = {
        ...prev,
        extractedData: {
          ...prev.extractedData,
          [topicName]: {
            explanation: explanation,
            youtubeIds: [],
            example: "Fill in the example here...",
            question: "Fill in the question here...",
            answer: "Fill in the answer here...",
          },
        },
        hiddenExplanations: {
          ...prev.hiddenExplanations,
          [topicName]: explanation,
        },
      };
      return updatedData;
    });

    // If autoToggle option is selected, generate the explanation, video, example, and question/answer
    if (autoToggle) {
      handleGenerateExplanation(topicName, hiddenExplanations);
      handleGenerateExample(topicName, hiddenExplanations);
      handleGenerateQuestionAnswer(topicName, hiddenExplanations);
    }
  };

  // Generate a new explanation for a topic
  const handleGenerateExplanation = async (topic, hiddenExplanations) => {
    try {
      const text = await generateExplanation(
        topic,
        hiddenExplanations || studyGuide.hiddenExplanations
      );
      updateStudyGuideObject(topic, "explanation", text);
    } catch (error) {
      toast.error("Failed to generate explanation. Please try again.");
    }
  };

  // Generate a new example for a topic
  const handleGenerateExample = async (topic, hiddenExplanations) => {
    try {
      const text = await generateExample(
        topic,
        hiddenExplanations ? hiddenExplanations : studyGuide.hiddenExplanations
      );
      updateStudyGuideObject(topic, "example", text);
    } catch (error) {
      toast.error("Failed to generate example. Please try again.");
    }
  };

  // Generate a new question and answer for a topic
  const handleGenerateQuestionAnswer = async (topic, hiddenExplanations) => {
    try {
      const text = await generateQuestionAnswer(
        topic,
        hiddenExplanations ? hiddenExplanations : studyGuide.hiddenExplanations
      );
      const question = text["question"];
      const answer = text["answer"];
      updateStudyGuideObject(topic, "question", question);
      updateStudyGuideObject(topic, "answer", answer);
    } catch (error) {
      toast.error("Failed to generate question and answer. Please try again.");
    }
  };

  return {
    editMode,
    setEditMode,
    handleEditClicked,
    handleDeleteSection,
    handleTopicDelete,
    handleAddTopic,
    handleGenerateExplanation,
    handleGenerateExample,
    handleGenerateQuestionAnswer,
    discardEdits,
    updateStudyGuideObject,
  };
};

export default useEditor;
