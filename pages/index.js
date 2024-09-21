import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef } from "react";
import { useRouter } from "next/router";

export default function Home() {
  // javascript here
  const router = useRouter();
  // Declare fileInputRef at the top level of the component
  const fileInputRef = useRef(null);

  // Function to handle the button click and open the file selector
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle the file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Send the file to the backend
      try {
        const response = await fetch("http://127.0.0.1:5000/extract", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        router.push({
          pathname: "/study",
          query: { extractedData: JSON.stringify(data) },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    // return html here
    <div>
      <Navbar />

      <Section>
        <Slogan>
          The{" "}
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>Smart</span>{" "}
          Way to
        </Slogan>
        <Slogan>
          Study{" "}
          <span style={{ color: "#F03A47", fontWeight: "bold" }}>Slides</span>
        </Slogan>

        <p style={{ fontSize: "18px", transform: "translateY(-120px)" }}>
          A software tool that creates comprehensive/interactive Study Guides
          equipped{" "}
        </p>
        <p style={{ fontSize: "18px", transform: "translateY(-120px)" }}>
          with plenty of useful resources to help you succeed in the classroom
        </p>

        {/* Button that triggers the file input click */}
        <UploadButton onClick={handleUploadClick}>Upload File</UploadButton>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Section>

      <Footer />
    </div>
  );
}

// define html and it's css here

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10vw;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
`;

const Slogan = styled.h1`
  font-size: 80px;
  color: #000000;
  font-weight: bold;
  transform: translateY(-150px);
`;

const UploadButton = styled.button`
  padding: 25px 40px;
  font-size: 35px;
  font-weight: bold;
  color: white;
  background-color: #f03a47;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(-80px);
`;
