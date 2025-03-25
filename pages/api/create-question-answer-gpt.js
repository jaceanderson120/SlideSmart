import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT_O3;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-12-01-preview";
const deployment = "o3-mini";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function createContent(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body; // Get the slides data from the request body

  // Creating the user message for practice problems
  const userMessage2 = `
    I am providing you with JSON in the following format: { 'topicName1': 'explanation1', 'topicName2': 'explanation2' ... }.
    Here is the JSON object: ${JSON.stringify(data)}.
    For each topic, please create a practice problem example. Please make sure that the practice problem answer can be found in and related back to the topic explanation.
    If your answer contains any code, enclose it in <pre><code>...</code></pre> tags.
    Return the refined data as JSON in this format: { 'topicName1': { 'question': 'question', 'answer': 'answer' }, 'topicName2': { 'question': 'question', 'answer': 'answer' } ... }.
  `;

  // Start the OpenAI completion for practice problems without waiting for YouTube API
  try {
    const completion = await openai.chat.completions.create({
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
    console.error("Error analyzing PowerPoint (creating content):", error);
    res.status(500).json({ error: error.message });
  }
}
