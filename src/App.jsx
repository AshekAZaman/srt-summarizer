import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.css";
import SearchResults from "./components/SearchResults";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]); // Define results state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [srtContent, setSrtContent] = useState("");
  const [hovering, setHovering] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate function
  const API_KEY = "1864fc7d";

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchSearchResults = async () => {
    if (!searchQuery) return;
  
    console.log("Searching for:", searchQuery);
  
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=${API_KEY}` // Added `type=movie`
      );
      console.log(response.data);
  
      if (response.data.Response === "True") {
        setResults(response.data.Search);
        setError(null);
        navigate("/search-results", { state: { searchResults: response.data.Search } });
      } else {
        setError("No movies found. Try another search.");
        setResults([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching search results.");
      setResults([]);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".srt")) {
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSrtContent(e.target.result);
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
        <button onClick={fetchSearchResults}>Search</button>
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

      {/* Display Extracted SRT Content */}
      {srtContent && (
        <div className="srt-preview">
          <h3>Extracted Subtitle Text:</h3>
          <p>{srtContent.substring(0, 500)}...</p>
        </div>
      )}

      {/* Display Error if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render search results */}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}

export default App;
