import formidable from "formidable";
import fs from "fs";
import { analyzePowerpoint } from "../../backend/gpt.js";
import pdf from "pdf-parse";

// // Disable Next.js built-in body parser to handle file uploads with formidable
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Helper function to extract text from PowerPoint using officeparser
// function extractTextFromPPT(pptFilePath) {
//   return new Promise((resolve, reject) => {
//     parser.parseOfficeAsync(pptFilePath, (err, data) => {
//       if (err) {
//         return reject("Error parsing PPTX file");
//       }

//       const slidesData = {};

//       data.forEach((slide, slideIndex) => {
//         const textArray = [];

//         slide.content.forEach((element) => {
//           if (element.type === "text") {
//             textArray.push(element.text);
//           }
//         });

//         slidesData[`slide${slideIndex + 1}`] = textArray;
//       });

//       resolve(slidesData);
//     });
//   });
// }

// Function to extract text from PDF by page
function extractTextFromPDF(pdfFilePath) {
  console.log("\n\n\nPATH: ", pdfFilePath);
  return new Promise((resolve, reject) => {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfFilePath);

    pdf(dataBuffer)
      .then((data) => {
        const pagesData = {};

        // Split the text by form feed characters (each page is separated by '\f')
        const pages = data.text.split(/\f/);

        // Loop through the pages and extract text
        pages.forEach((pageText, pageIndex) => {
          const textArray = [];

          // Split page text by lines and filter out empty lines
          pageText.split("\n").forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              textArray.push(trimmedLine);
            }
          });

          // Store the extracted lines as an array under the page key
          pagesData[`page${pageIndex + 1}`] = textArray;
        });

        resolve(pagesData);
      })
      .catch((err) => {
        reject("Error parsing PDF file: " + err);
      });
  });
}

export default async function handler(req, res) {
  console.log("HELLLLLLLLOOOO");
  if (req.method === "POST") {
    console.log("hi");
    const form = formidable();

    // Parse the incoming form with formidable
    form.parse(req, async (err, fields, files) => {
      console.log("form here");
      if (err) {
        console.log("IF 1");
        return res.status(500).json({ error: "Error parsing form data" });
      }

      // Access the uploaded file
      const uploadedFile = files.file[0];
      console.log(uploadedFile.originalFilename);

      if (!uploadedFile) {
        console.log("IF 2");
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check if the uploaded file is a .pptx file
      if (!uploadedFile.originalFilename.endsWith(".pdf")) {
        console.log("IF 3");
        return res.status(400).json({ error: "File type not allowed" });
      }
      console.log("HELLO");
      try {
        // Extract text from the PPTX file
        const extractedData = await extractTextFromPDF(uploadedFile.filepath);
        console.log(extractedData);

        // Analyze the extracted text (assuming analyzePowerpoint is your function)
        const analyzedData = await analyzePowerpoint(extractedData);

        // Send the analyzed data as the response
        res.json(analyzedData);
      } catch (error) {
        console.error("Error processing the file:", error);
        res.status(500).json({ error: error.message });
      } finally {
        // Clean up: Remove the temporary file
        fs.unlink(uploadedFile.filepath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting the temporary file:", unlinkErr);
          }
        });
      }
    });
  } else {
    console.log("else");
    res.status(405).json({ message: "Method not allowed" });
  }
}
