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

  const data = req.body; // Get the text from the body of the request

  // Creating the user message for examples
  const userMessage = `
    Below is the text extracted from a PowerPoint presentation.
    Based on this text, please generate a set of Q&A flashcards for exam study and extract key terms with their definitions.
    Please produce valid JSON in the form (no code fences, no extra text):
    {
      "question1": "answer1",
      "question2": "answer2",
      "term1": "definition1",
      "term2": "definition2"
      ...
    }
    For example, if the input text mentions 'Photosynthesis is the process by which plants convert sunlight into energy,' a valid output could be:
    {
      "What is photosynthesis?": "The process by which plants convert sunlight into energy.",
      "Photosynthesis": "The process by which plants convert sunlight into energy."
    }
    Here is the text from the slideshow: ${JSON.stringify(data)}
  `;

  // Start the OpenAI completion for examples without waiting for YouTube API
  try {
    const completion = await openai.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a professional at creating flashcards for studying from slideshows.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const chatMessage = completion.choices[0].message.content;

    let flashcards;
    try {
      flashcards = JSON.parse(chatMessage);
    } catch (error) {
      flashcards = { rawOutput: chatMessage };
    }

    res.status(200).json(flashcards);
  } catch (error) {
    console.error("Error generating new explanation:", error);
    res.status(500).json({ error: error.message });
  }
}
