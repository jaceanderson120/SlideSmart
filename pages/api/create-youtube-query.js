import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function createYouTubeQuery(req, res) {
  const data = req.body;

  // Creating the user prompt
  const prompt = `I am trying to find a YouTube video about ${data.topic}: ${data.explanation}
  Please generate a YouTube search query.
  Be sure to make the query specifically related to the explanation provided.
  Make sure the query is clear and concise.
  Please don't use any language like "tutorial" or "how to" or "explained" in the query.`;

  try {
    const completion = await openai.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at generating YouTube search queries given a topic. You respond to prompts with a YouTube search query.",
        },
        { role: "user", content: prompt },
      ],
    });

    const query = completion.choices[0].message.content;
    res.status(200).json(query);
  } catch (error) {
    console.error("Error creating a YouTube search query:", error);
    res.status(500).json({ error: error.message });
  }
}
