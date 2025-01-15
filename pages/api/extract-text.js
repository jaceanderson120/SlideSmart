import officeParser from "officeparser";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fileUrl } = req.body;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const data = await officeParser.parseOfficeAsync(fileBuffer);
      res.json(data);
    } catch (error) {
      console.error("Error processing the file:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
