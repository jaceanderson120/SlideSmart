import { useState } from "react";

export default function Example() {
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const backendURL = "http://127.0.0.1:5000"; // Switch this to your backendURL

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
        setExtractedData(data);
        setError(null);
      } else {
        setError("Error extracting data");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Extract Data from PowerPoint</h1>
      <button onClick={handleExtract}>Extract Data</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {extractedData && (
        <div>
          <h2>Extracted Data</h2>
          {/* Display the raw content as returned by the message.content */}
          <pre>{extractedData}</pre>
        </div>
      )}
    </div>
  );
}
