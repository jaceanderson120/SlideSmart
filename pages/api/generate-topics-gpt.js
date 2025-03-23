import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT_O3;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-12-01-preview";
const deployment = "o3-mini";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function getTopics(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const topic = req.body; // Get the slides data from the request body
  const userMessage1 = `
    Please create a comprehensive learning plan for students to learn all about ${JSON.stringify(
      topic
    )}.
    Based off of the comprehensive learning plan you develop, create the following:
    1. **Identifying Topics**:
      - Identify and list the most important topics to learn this.
      - Aim for no more than 8 topics unless more topics are absolutely necessary.

    2. **Explanation of Topics**:
      - For each topic, develop a detailed explanation.
      - Make sure each explanation is clear and easy to understand.
      
    Finally, return the data in JSON format as follows: 
    {
      'topicName1': 'explanation1', 
      'topicName2': 'explanation2',
    ...
    }
    Make sure each "topicName" is concise yet descriptive, and each "explanation” is a thorough, coherent paragraph or two.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are an academic tutor with an expertise in creating study guides. Respond in valid JSON format with no additional commentary.",
        },
        { role: "user", content: userMessage1 },
      ],
      response_format: { type: "json_object" },
    });

    // Send the response of topic names and explanations back to the frontend
    const topicsAndSummaries = JSON.parse(
      completion.choices[0].message.content
    );
    res.status(200).json(topicsAndSummaries);
  } catch (error) {
    console.error("Error analyzing PowerPoint (getting topics):", error);
    res.status(500).json({ error: error.message });
  }
}
