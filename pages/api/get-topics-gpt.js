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
    I am providing you with a string of text extracted from a PowerPoint presentation. Here is the string: ${JSON.stringify(
      slidesData
    )}
    Please analyze the text and develop a comprehensive learning plan for students. Based off of the comprehensive learning plan you develop, create the following:
    1. **Explanations for Each Topic**: Create detailed explanations for each topic in the comprehensive learning plan. Include relevant details from the PowerPoint and ensure the explanations are thorough.
    2. **Number of Topics**: Try to limit the number of topics to a maximum of 8 unless you really need to generate more than that. You may combine topics if it makes sense to as needed.
    3. **Transitional Topics**: Feel free to introduce additional topics that connect the existing ones in a cohesive manner.
    4. **Ordering of Topics**: Maintain the same order of topics as they appear in the PowerPoint. Precede each topic name with its corresponding number to indicate its position.
    5. **Relevant Content**: Avoid including non-informational items such as homework, exam dates, slide outlines, or lecture summaries in your explanations.
    6. **YouTube Search Query**: Based on the topic and explanation you create, also create a relevant YouTube search query that a student can use to find additional resources on the topic.
    Finally, return the data in JSON format as follows: 
    { 
        'topicName1': ['explanation', 'YouTube search query'], 
        'topicName2': ['explanation', 'YouTube search query'], 
        ...
    }
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a prefessor reviewing PowerPoints created by fellow professors. Make the PowerPoint easy for a student to understand. Respond in JSON format.",
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
    console.error("Error analyzing PowerPoint:", error);
    res.status(500).json({ error: error.message });
  }
}
