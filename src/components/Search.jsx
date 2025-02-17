import { useState } from "react";
import axios from "axios";
import "./Search.css";

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const Search = ({ searchQuery, setSearchQuery, onSearchResults, navigate }) => {
  const [hovering, setHovering] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) return; // Prevent empty searches

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=${OMDB_API_KEY}`
      );

      if (response.data.Response === "True") {
        onSearchResults(response.data.Search, null);
        navigate("/search-results", { state: { searchResults: response.data.Search } });
      } else {
        onSearchResults([], "No movies found. Try another search.");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      onSearchResults([], "Error fetching search results. Please try again later.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchSearchResults();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a movie... 🎬"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className={`search-input ${hovering === "search" ? "focused" : ""}`}
        onMouseEnter={() => setHovering("search")}
        onMouseLeave={() => setHovering("")}
      />
      <button onClick={fetchSearchResults} className="search-button">
        Search 🔍
      </button>
    </div>
  );
};

export default Search;
