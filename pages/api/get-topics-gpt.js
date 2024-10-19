import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export default async function getTopics(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slidesData = req.body; // Get the slides data from the request body
  const userMessage1 = `
        I am providing you with a string of text which was extracted from a PowerPoint. Here is the string: ${JSON.stringify(
          slidesData
        )}
        Understand the text and tell me what topics the PowerPoint is about.
        Summarize each topic in the PowerPoint.
        When you summarize a topic, summarize it as if you are teaching it to me in a few sentences or a paragraph.
        Return the data as JSON in the format { 'topicName1': 'summary', 'topicName2': 'summary' ... }.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional at interpreting PowerPoints created by professors. Your goal is to make the PowerPoint extremely easy for a student to understand. You will respond to all prompts with JSON.",
        },
        { role: "user", content: userMessage1 },
      ],
      response_format: { type: "json_object" },
    });

    // Send the response of topic names and summaries back to the frontend
    const topicsAndSummmaries = JSON.parse(
      completion.choices[0].message.content
    );
    res.status(200).json(topicsAndSummmaries);
  } catch (error) {
    console.error("Error analyzing PowerPoint:", error);
    res.status(500).json({ error: error.message });
  }
}
