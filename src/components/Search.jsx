import { useState } from "react";
import axios from "axios";
import "./Search.css";

const API_KEY = "1864fc7d";

const Search = ({ searchQuery, setSearchQuery, onSearchResults, navigate }) => {
  const [hovering, setHovering] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchSearchResults = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=${API_KEY}`
      );

      if (response.data.Response === "True") {
        onSearchResults(response.data.Search, null);
        navigate("/search-results", { state: { searchResults: response.data.Search } });
      } else {
        onSearchResults([], "No movies found. Try another search.");
      }
    } catch (err) {
      onSearchResults([], "Error fetching search results.");
    }
  };

  return (
    <>
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
    </>
  );
};

export default Search;
