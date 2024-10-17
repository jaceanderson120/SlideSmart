import formidable from "formidable";
import fs from "fs";
import { analyzePowerpoint } from "../../backend/gpt.js";
import pdf from "pdf-parse";

// This function extracts all of the text from a PDF
// For now SlideSmart only accepts PDFs, but in the future we can use a library to convert Office Docs -> PDF
function extractTextFromPDF(pdfFilePath) {
  return new Promise((resolve, reject) => {
    const dataBuffer = fs.readFileSync(pdfFilePath);
    pdf(dataBuffer)
      .then((data) => {
        resolve(data.text);
      })
      .catch((err) => {
        reject("Error parsing PDF file: " + err);
      });
  });
}

// NEEDED: DISABLE THE DEFAULT NEXT.JS BODY PARSING BEHAVIOR
export const config = {
  api: {
    bodyParser: false,
  },
};

// When the frontend sends a request to api/extract this function will be executed
export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    if (req.method === "POST") {
      const form = formidable({ multiples: false }); // Do not allow multiple file uploads

      // Parse the incoming form with formidable
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form data:", err);
          return reject(
            res.status(500).json({ error: "Error parsing form data" })
          );
        }

        // Access the uploaded file
        const uploadedFile = files.file[0];

        // Return if no file was uploaded
        if (!uploadedFile) {
          return reject(res.status(400).json({ error: "No file uploaded" }));
        }

        // Check if the uploaded file is a .pdf file
        if (!uploadedFile.originalFilename.endsWith(".pdf")) {
          return reject(
            res.status(400).json({ error: "File type not allowed" })
          );
        }

        // Extract text from the PDF file
        extractTextFromPDF(uploadedFile.filepath)
          .then((extractedData) => {
            // Analyze the extracted text
            return analyzePowerpoint(extractedData);
          })
          .then((analyzedData) => {
            // Send the analyzed data as the response
            res.json(analyzedData);
            resolve(); // Resolve the promise after sending the response
          })
          .catch((error) => {
            console.error("Error processing the file:", error);
            reject(res.status(500).json({ error: error.message }));
          })
          .finally(() => {
            // Clean up: Remove the temporary file
            fs.unlink(uploadedFile.filepath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting the temporary file:", unlinkErr);
              }
            });
          });
      });
    } else {
      reject(res.status(405).json({ message: "Method not allowed" }));
    }
  });
}
