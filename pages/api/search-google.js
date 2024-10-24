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
    // Filter down to the top 3 results
    const filteredResults = results.items?.slice(0, 3).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to fetch search results");
  }
}
