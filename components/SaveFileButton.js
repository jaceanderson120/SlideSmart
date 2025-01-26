// SaveFileButton.jsx
import React from "react";

const SaveFileButton = ({ onClick }) => {
  const styles = {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#007BFF",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#0056b3";
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "#007BFF";
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      Save File
    </button>
  );
};

export default SaveFileButton;
