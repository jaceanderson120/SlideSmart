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

  // Creating the user message for examples
  const userMessage = `
    I am providing you with JSON in the following format: { 'topicName1': 'explanation', 'topicName2': 'explanation' ... }.
    Here is the JSON object: ${JSON.stringify(
      data
    )}. For each topic, please show an example of the topic in practice.
    For topics where it in practice cannot be shown in a short sample then provide a real world example where it would be used.
    Return the refined data as JSON in this format: { 'topicName1': 'example1', 'topicName2': 'example2' ... }.
  `;

  // Start the OpenAI completion for examples without waiting for YouTube API
  try {
    const completion = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at generating real-world examples of topics. You respond to prompts with JSON.",
        },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const createdContent = JSON.parse(completion.choices[0].message.content);

    res.status(200).json(createdContent);
  } catch (error) {
    console.error("Error analyzing PowerPoint (creating examples):", error);
    res.status(500).json({ error: error.message });
  }
}
