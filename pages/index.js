// This is a basic example of what a pages file could look like.
import { useState } from "react";

export default function Home() {
  const [extractedText, setExtractedText] = useState(null);
  const [error, setError] = useState(null);
  const [backendURL, setBackendURL] = useState("http://127.0.0.1:5000"); // Switch this to your backendURL

  const handleExtract = async () => {
    try {
      // Access the backend
      const response = await fetch(`${backendURL}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedText(data);
      } else {
        setError("Error extracting text");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Extract Text from PowerPoint</h1>
      <button onClick={handleExtract}>Extract Text</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {extractedText && (
        <div>
          <h2>Extracted Text</h2>
          <pre>{JSON.stringify(extractedText, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
