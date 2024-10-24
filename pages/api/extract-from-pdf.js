import formidable from "formidable";
import fs from "fs";
import officeParser from "officeparser";

// NEEDED: DISABLE THE DEFAULT NEXT.JS BODY PARSING BEHAVIOR
export const config = {
  api: {
    bodyParser: false,
  },
};

// When the frontend sends a request to api/extract this function will be executed
export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false }); // Do not allow multiple file uploads
    let uploadedFile;

    try {
      // Parse the incoming form with formidable
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            return reject(
              res.status(500).json({ error: "Error parsing form data" })
            );
          }
          resolve({ fields, files });
        });
      });

      // Access the uploaded file
      uploadedFile = files.file[0];

      // Return if no file was uploaded
      if (!uploadedFile) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract text from the PDF file
      const extractedData = await extractTextFromPDF(uploadedFile.filepath);

      // Send the extracted data as the response
      res.json(extractedData);
    } catch (error) {
      console.error("Error processing the file:", error);
      res.status(500).json({ error: error.message });
    } finally {
      // Remove the temporary file
      if (uploadedFile) {
        try {
          await fs.promises.unlink(uploadedFile.filepath);
        } catch (unlinkErr) {
          console.error("Error deleting the temporary file:", unlinkErr);
        }
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

// This function extracts all of the text from a PDF file or Office document
async function extractTextFromPDF(pdfFilePath) {
  try {
    const fileBuffers = fs.readFileSync(pdfFilePath);
    const data = await officeParser.parseOfficeAsync(fileBuffers);
    return data;
  } catch (err) {
    console.error("Error extracting text:", err);
  }
}
