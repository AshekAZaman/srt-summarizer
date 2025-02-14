import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";

const API_KEY = "GZyDgiglxWR498vYHj7gtuC5diFwxRBR";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=1864fc7d`
        );

        if (response.data.Response === "True") {
          setMovie(response.data);
          fetchSubtitles(response.data.imdbID);
        } else {
          setError("Movie details not found.");
        }
      } catch (err) {
        setError("Error fetching movie details.");
      }
      setLoading(false);
    };

    const fetchSubtitles = async (imdbID) => {
      try {
        const response = await axios.get(
          `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbID}`,
          {
            headers: {
              "Api-Key": API_KEY,
              "Content-Type": "application/json",
              "User-Agent": "SRTSummarizer v1.0",
            },
          }
        );

        if (response.data && response.data.data) {
          // Set only the first 5 subtitles
          setSubtitles(response.data.data.slice(0, 5));
        } else {
          setSubtitles([]);
        }
      } catch (err) {
        console.error("Error fetching subtitles:", err);
        setSubtitles([]);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!movie) return <p>No movie data found.</p>;

  return (
    <div className="movie-details-container">
      <img src={movie.Poster} alt={movie.Title} />
      <div className="movie-info">
        <h2>
          {movie.Title} ({movie.Year})
        </h2>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Director:</strong> {movie.Director}
        </p>
        <p>
          <strong>Plot:</strong> {movie.Plot}
        </p>
        <p>
          <strong>IMDB Rating:</strong> {movie.imdbRating}
        </p>

        {/* Subtitles Section */}
        <h3>Available Subtitles</h3>
        {subtitles.length > 0 ? (
          <ul>
            {subtitles.map((sub) => {
              const subtitleLink = sub.attributes.url
                ? sub.attributes.url
                : `https://www.opensubtitles.com/en/subtitles/${sub.id}`;

              return (
                <li key={sub.id}>
                  <a
                    href={subtitleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {sub.attributes.language} - {sub.attributes.release}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No subtitles found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
