// This is a basic example of what a pages file could look like.
import { useState } from "react";
import styled from "styled-components";

export default function Example() {
  const [extractedText, setExtractedText] = useState(null);
  const [extractedImages, setExtractedImages] = useState(null);
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
        setExtractedImages(data["images"]);
        setExtractedText(data["text"]);
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

      {extractedImages && (
        <div>
          <h2>Extracted Images</h2>
          {Object.keys(extractedImages).map((slideKey) => (
            <div key={slideKey}>
              <h3>{slideKey}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {extractedImages[slideKey].map((imageBase64, index) => (
                  <Image
                    key={index}
                    src={`data:image/png;base64,${imageBase64}`}
                    alt={`Slide ${slideKey} Image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Image = styled.img`
  width: 150px;
  height: auto;
  border: 1px solid #ccc;
`;
