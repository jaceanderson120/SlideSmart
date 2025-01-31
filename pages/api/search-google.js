import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.CUSTOM_SEARCH_API_KEY;
const cx = process.env.CUSTOM_SEARCH_CX;

export default async function searchGoogle(req, res) {
  const query = req.body.query;

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const results = await response.json();

    if (!results.items || results.items.length === 0) {
      // Still a 200 response, but no search results
      return res.status(200).json({ error: "No search results found" });
    }

    // Filter down to the top 1 result
    const topResult = {
      title: results.items[0].title,
      link: results.items[0].link,
      snippet: results.items[0].snippet,
    };
    res.status(200).json(topResult);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to fetch search results");
  }
}
