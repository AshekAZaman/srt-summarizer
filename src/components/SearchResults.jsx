import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const { searchResults } = location.state || { searchResults: [] };

  return (
    <div className="search-results-container">
      <h2>🔍 Search Results</h2>

      {searchResults.length > 0 ? (
        <div className="movie-list">
          {searchResults.map((movie) => (
            <div className="movie-item" key={movie.imdbID}>
              <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: "none", color: "inherit" }} aria-label={`View details for ${movie.Title} (${movie.Year})`}>
                <img src={movie.Poster} alt={movie.Title} />
                <h3>{movie.Title} ({movie.Year})</h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found 😔</p>
      )}
    </div>
  );
};

export default SearchResults;
