import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Use GPT-4o here, it is sufficient and o3-mini takes very long
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function createYouTubeQuery(req, res) {
  const data = req.body;

  // Creating the user prompt
  const prompt = `Generate a natural YouTube search query based on the topic and explanation below.

  Topic: ${data.topic}  
  Explanation: ${data.explanation}  

  The query should:
  - Sound **natural and conversational** (like something a real person would type).  
  - Be **concise** (under 8 words).  
  - **Avoid copying** the topic/explanation exactly—focus on what someone would actually search for.  
  - **Exclude lesson numbers** (e.g., "Unit 5.1") and platform names (e.g., "Canvas").  
  - If needed, use **actionable phrasing** (e.g., "tips for," "best way to," "how to").

  Return **only** the search query, nothing else.`;

  try {
    const completion = await openai.chat.completions.create({
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
