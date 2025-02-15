import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import FileUpload from "./components/FileUpload";
import SrtPreview from "./components/SrtPreview";
import SearchResults from "./components/SearchResults";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [srtContent, setSrtContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearchResults = (searchResults, errorMessage) => {
    setResults(searchResults);
    setError(errorMessage);
  };

  return (
    <div className="container">
      <h1>SRT Summarizer</h1>
      <div className="inputs-container">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchResults={handleSearchResults}
          navigate={navigate}
        />
        <p>OR</p>
        <FileUpload
          setUploadedFile={setUploadedFile}
          setSrtContent={setSrtContent}
        />
      </div>
      {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
      {srtContent && <SrtPreview srtContent={srtContent} />}
      {error && <ErrorMessage error={error} />}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}

export default App;
