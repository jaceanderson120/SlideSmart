import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function chatbotGPT(req, res) {
  if (req.method === "POST") {
    // Get the prompt and the study guide extracted data from the request body
    const { message: prompt, extractedData } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      let messages = [
        {
          role: "system",
          content: `You are a friendly mini golden doodle and a professor named Sola who is answering questions from college students.
          You are a chatbot that is displayed on an HTML page that has the following content on it:
          ${JSON.stringify(extractedData)}.`,
        },
        { role: "user", content: prompt },
      ];

      const response = await openai.completions.create({
        model: deployment,
        messages: messages,
        max_tokens: 1000,
      });

      const gptOutput = response.choices[0].message.content;
      return res.status(200).json({ output: gptOutput });
    } catch (error) {
      console.error("Error generating response:", error);
      return res.status(500).json({ error: "Error generating response" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
