import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isReadyToSummarize, setIsReadyToSummarize] = useState(false);
  const navigate = useNavigate();

  const handleSearchResults = (searchResults, errorMessage) => {
    setResults(searchResults);
    setError(errorMessage);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/x-subrip" || file.name.endsWith(".zip") || file.name.endsWith(".ssa") || file.name.endsWith(".srt")) {
        setUploadedFile(file);
        setIsReadyToSummarize(true);
      } else {
        alert("🚫 Please upload a valid subtitle file (.srt, .zip, .ssa).");
        setUploadedFile(null);
        setIsReadyToSummarize(false);
      }
    }
  };

  const handleSummarization = () => {
    if (uploadedFile) {
      console.log("Navigating to /summarize with file:", uploadedFile);
      navigate("/summarize", { state: { file: uploadedFile } });
    } else {
      alert("⚠️ Please upload a subtitle file first.");
    }
  };

  return (
    <div className="container">
      <h1 onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
        SRT Summarizer 🎥
      </h1>

      <div className="inputs-container">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchResults={handleSearchResults}
          navigate={navigate}
        />
        <p>OR</p>
        <h3>Upload Subtitle File for Summarization 📄</h3>
        <input
          type="file"
          accept=".srt,.zip,.ssa"
          onChange={handleFileUpload}
        />
        {uploadedFile && (
          <p>✅ Uploaded: {uploadedFile.name}</p>
        )}
        {isReadyToSummarize && (
          <button onClick={handleSummarization} className="summarize-button">
            Start Summarizing 🔄
          </button>
        )}
      </div>
      {error && <ErrorMessage error={error} />}
      {results.length > 0 && <SearchResults results={results} />}

      <footer className="footer">
  <div className="footer-content">
    <p className="footer-text">From <span className="highlight">Ashek A Zaman</span></p>
    <div className="social-links">
      <a href="https://www.linkedin.com/in/ashekazaman/" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin"></i> LinkedIn
      </a>
      <a href="https://github.com/AshekAZaman/srt-summarizer" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github"></i> GitHub
      </a>
    </div>
  </div>
</footer>
    </div>
  );
}

export default App;