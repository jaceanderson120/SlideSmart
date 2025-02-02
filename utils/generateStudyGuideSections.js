// Generates an explanation for a given topic
// Input: topic: string with the topic name
//        hiddenExplanations: string with the hidden explanations
// Output: explanation, string with the generated explanation
const generateExplanation = async (topic, hiddenExplanations) => {
  const hiddenExplanation = JSON.parse(hiddenExplanations)[topic];

  // Create object of topic and explanation
  const data = {};
  data[topic] = hiddenExplanation;

  const explanation = await fetch("/api/create-explanation-gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create explanation");
    }
    return res.json();
  });
  return explanation;
};

// Generates an example for a given topic
// Input: topic: string with the topic name
//        hiddenExamples: string with the hidden examples
// Output: example, string with the generated example
const generateExample = async (topic, hiddenExamples) => {
  const hiddenExample = JSON.parse(hiddenExamples)[topic];

  // Create object of topic and example
  const data = {};
  data[topic] = hiddenExample;

  const example = await fetch("/api/create-examples-gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create explanation");
    }
    return res.json();
  });
  return example[topic];
};

// Generates a question and answer for a given topic
// Input: topic: string with the topic name
//        hiddenQuestions: string with the hidden questions
// Output: question, string with the generated question
const generateQuestionAnswer = async (topic, hiddenQuestions) => {
  const hiddenQuestion = JSON.parse(hiddenQuestions)[topic];

  // Create object of topic and question
  const data = {};
  data[topic] = hiddenQuestion;

  const questionAnswer = await fetch("/api/create-question-answer-gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create question/answer");
    }
    return res.json();
  });
  return questionAnswer[topic];
};

export { generateExplanation, generateExample, generateQuestionAnswer };
