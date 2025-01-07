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
    // Get the recent messages and the study guide extracted data from the request body
    const { messages, extractedData } = req.body;

    try {
      const formattedMessages = [
        {
          role: "system",
          content: `You are a friendly mini golden doodle and a professor named Sola who is answering questions from college students. You are a chatbot that is displayed on an HTML page that has the following content on it: ${JSON.stringify(
            extractedData
          )}.`,
        },
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      ];

      const response = await openai.completions.create({
        model: deployment,
        messages: formattedMessages,
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
