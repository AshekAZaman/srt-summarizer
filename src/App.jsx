import { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [srtContent, setSrtContent] = useState("");
  const [hovering, setHovering] = useState(""); // Track hover state

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Searching for:", event.target.value);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".srt")) {
      setUploadedFile(file);

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrtContent(e.target.result); // Store the file content
        console.log("SRT Content:", e.target.result); // Debugging output
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .srt file");
    }
  };

  return (
    <div className="container">
      <h1>SRT Summarizer</h1>

      {/* Inputs Container: Search and File Upload */}
      <div className="inputs-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`search-input ${hovering === "search" ? "focused" : ""}`}
          onMouseEnter={() => setHovering("search")}
          onMouseLeave={() => setHovering("")}
        />
        <p>OR</p>
        <input
          type="file"
          accept=".srt"
          onChange={handleFileUpload}
          className={`file-input ${hovering === "file" ? "focused" : ""}`}
          onMouseEnter={() => setHovering("file")}
          onMouseLeave={() => setHovering("")}
        />
      </div>

      {/* Show uploaded file name */}
      {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}

      {/* Display Extracted SRT Content (optional) */}
      {srtContent && (
        <div className="srt-preview">
          <h3>Extracted Subtitle Text:</h3>
          <p>{srtContent.substring(0, 500)}...</p> {/* Show first 500 chars */}
        </div>
      )}
    </div>
  );
}


export default App;
