import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Summarize.css";

const Summarize = () => {
  const location = useLocation();
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    if (location.state?.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(location.state.file);
    }
  }, [location.state?.file]);

  return (
    <div className="summarize-container">
      <h2>Subtitle File Content</h2>
      {fileContent ? (
        <pre>{fileContent}</pre>
      ) : (
        <p>No subtitle file uploaded.</p>
      )}
      {/* Placeholder: In the future, add summarization process trigger here */}
    </div>
  );
};

export default Summarize;
