import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import formidable from "formidable";
import fs from "fs";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const convertToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("base64"));
      }
    });
  });
};

export default async function chatbotGPT(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const messages = JSON.parse(fields.messages);
      const extractedData = JSON.parse(fields.extractedData);

      let base64Image = null;
      if (files.image) {
        base64Image = await convertToBase64(files.image[0].filepath);
      }

      try {
        const formattedMessages = [
          {
            role: "system",
            content: `You are a friendly mini golden doodle and a professor named Sola who is answering questions from college students. You are a chatbot that is displayed on an HTML page that has the following content on it: ${JSON.stringify(
              extractedData
            )}.`,
          },
          ...messages.slice(0, -1).map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        ];

        if (base64Image) {
          const lastMessage = messages[messages.length - 1];
          formattedMessages.push({
            role: "user",
            content: [
              {
                type: "text",
                text: lastMessage.text,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${base64Image}` },
              },
            ],
          });
        } else {
          const lastMessage = messages[messages.length - 1];
          formattedMessages.push({
            role: lastMessage.sender === "user" ? "user" : "assistant",
            content: lastMessage.text,
          });
        }

        const response = await openai.completions.create({
          model: deployment,
          messages: formattedMessages,
          max_tokens: 1000,
        });

        const gptOutput = response.choices[0].message.content;
        return res.status(200).json({ output: gptOutput });
      } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
