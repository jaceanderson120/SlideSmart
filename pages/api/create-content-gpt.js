import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function createContent(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const topicsAndSummmaries = req.body; // Get the slides data from the request body

  // Creating the user message for practice problems
  const userMessage2 = `
            I am providing you with JSON in the following format: { 'topicName1': 'explanation', 'topicName2': 'explanation' ... }.
            Here is the JSON object: ${JSON.stringify(topicsAndSummmaries)}.
            For each topic, please create a practice problem question.
            Return the refined data as JSON in this format: { 'topicName1': { 'question': 'question', 'answer': 'answer' }, 'topicName2': { 'question': 'question', 'answer': 'answer' } ... }.
        `;

  // Start the OpenAI completion for practice problems without waiting for YouTube API
  try {
    const completion = await openai.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at generating practice problems given a topic and topic explanation. You respond to prompts with JSON.",
        },
        { role: "user", content: userMessage2 },
      ],
      response_format: { type: "json_object" },
    });

    const createdContent = JSON.parse(completion.choices[0].message.content);

    res.status(200).json(createdContent);
  } catch (error) {
    console.error("Error analyzing PowerPoint:", error);
    res.status(500).json({ error: error.message });
  }
}
