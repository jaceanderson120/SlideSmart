import { OpenAI } from "openai"; // Adjust based on your version
import dotenv from "dotenv";
import { getYoutubeVideo } from "./youtube.js";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export async function analyzePowerpoint(slidesData) {
  const userMessage1 = `
        I am providing you with a string of text which was extracted from a PowerPoint. Here is the string: ${JSON.stringify(
          slidesData
        )}
        Understand the text and tell me what topics the PowerPoint is about.
        Summarize each topic in the PowerPoint.
        When you summarize a topic, summarize it as if you are teaching it to me in a few sentences or a paragraph.
        Return the data as JSON in the format { 'topicName1': 'summary', 'topicName2': 'summary' ... }.
    `;

  try {
    const completion1 = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional at interpreting PowerPoints created by professors. Your goal is to make the PowerPoint extremely easy for a student to understand. You will respond to all prompts with JSON.",
        },
        { role: "user", content: userMessage1 },
      ],
    });

    const response1 = JSON.parse(completion1.choices[0].message.content);

    const userMessage2 = `
            I am providing you with JSON in the following format: { 'topicName1': 'summary', 'topicName2': 'summary' ... }.
            Here is the JSON object: ${JSON.stringify(response1)}.
            For each topic, please create a practice problem question.
            Return the refined data as JSON in this format: { 'topicName1': { 'question': 'question', 'answer': 'answer' }, 'topicName2': { 'question': 'question', 'answer': 'answer' } ... }.
        `;

    const completion2 = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional at generating practice problems given a topic and topic summary. You respond to prompts with JSON.",
        },
        { role: "user", content: userMessage2 },
      ],
    });

    const response2 = JSON.parse(completion2.choices[0].message.content);

    // Fetch YouTube IDs for all topics in parallel
    const topics = Object.keys(response1);
    const youtubePromises = topics.map((topic) => getYoutubeVideo(topic));
    const youtubeIds = await Promise.all(youtubePromises);

    // Combine responses
    const combinedResponse = {};
    topics.forEach((topic, index) => {
      combinedResponse[topic] = {
        summary: response1[topic],
        question: response2[topic]?.question || "",
        answer: response2[topic]?.answer || "",
        youtubeId: youtubeIds[index], // Get the YouTube ID corresponding to the topic
      };
    });

    return combinedResponse;
  } catch (error) {
    console.error("Error analyzing PowerPoint:", error);
    throw error;
  }
}
