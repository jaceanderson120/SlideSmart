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

  const data = req.body; // Get the topic and the hidden explanation from the body

  // Creating the user message for examples
  const userMessage = `
    I am providing you with JSON in the following format: {'topicName': 'explanation'}.
    Here is the JSON object: ${JSON.stringify(
      data
    )}. Generate a new explanation for this topic and only return the explanation.
    If your answer contains any code, enclose it in <pre><code>...</code></pre> tags.
    You may give an explanation in bullet points if you see fit.
  `;

  // Start the OpenAI completion for examples without waiting for YouTube API
  try {
    const completion = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at generating explanations of topics.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const createdExplanation = completion.choices[0].message.content;
    res.status(200).json(createdExplanation);
  } catch (error) {
    console.error("Error generating new explanation:", error);
    res.status(500).json({ error: error.message });
  }
}
