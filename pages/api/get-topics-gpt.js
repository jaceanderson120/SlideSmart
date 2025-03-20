import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export default async function getTopics(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slidesData = req.body; // Get the slides data from the request body
  const userMessage1 = `
    I am providing you with a string of text extracted from a PowerPoint presentation below.
    Please analyze the text and develop a comprehensive learning plan for students. Based off of the comprehensive learning plan you develop, create the following:
    1. **Identifying Topics**:
      - Identify and list the most important topics for the slides.
      - Aim for no more than 8 topics unless more topics are absolutely necessary.
      - Combine or omit minor or duplicate topics.
      - Keep the topics relevant to info that is strictly in the slides.

    2. **Explanation of Topics**:
      - For each topic, develop a detailed explanation.
      - If there is sufficient text in the slides relating to a topic, focus on and mirror that information.
      - If there is insufficient text, you may supplement the explanation with necessary context, but keep it concise, accurate, and clearly related to the topic.
      - When adding additional information, ensure each explanation is easy to understand, accurate, and focused on the slides.

    3. **Relevant Content**:
      - Avoid including non-informational items such as homework, exam dates, slide outlines, or lecture summaries in your explanations.

    4. **Match the Complexity**:
      - If the slides discuss advanced or specialized topics (e.g., graduate-level physics), your supplemental details should reflect that depth and use appropriate terminology.
      - If the slides are more basic or introductory (e.g., elementary algebra), keep your supplemental details simple and concise.
      
    Finally, return the data in JSON format as follows: 
    {
      'topicName1': 'explanation1', 
      'topicName2': 'explanation2',
    ...
    }
    Make sure each "topicName" is concise yet descriptive, and each "explanation” is a thorough, coherent paragraph or two.
    
    Here is the powerpoint: ${JSON.stringify(slidesData)}
`;

  try {
    const completion = await openai.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are an academic tutor with an expertise in creating study guides. Make the PowerPoint easy for a student to understand. Respond in valid JSON format with no additional commentary.",
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
