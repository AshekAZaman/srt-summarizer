import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OPENSUBTITLES_API_KEY = import.meta.env.VITE_OPENSUBTITLES_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subtitles, setSubtitles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isReadyToSummarize, setIsReadyToSummarize] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`
        );
        if (response.data.Response === "True") {
          setMovie(response.data);
          fetchSubtitles(response.data.imdbID);
        } else {
          throw new Error("Movie details not found.");
        }
      } catch (err) {
        setError(err.message || "Error fetching movie details.");
        setLoading(false);
      }
    };

    const fetchSubtitles = async (imdbID) => {
      try {
        const response = await axios.get(
          `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbID}`,
          {
            headers: {
              "Api-Key": OPENSUBTITLES_API_KEY,
              "Content-Type": "application/json",
              "User-Agent": "SRTSummarizer v1.0",
            },
          }
        );

        if (response.data?.data) {
          const englishSubtitles = response.data.data.filter(
            (sub) => sub.attributes.language === "en"
          );
          setSubtitles(englishSubtitles.slice(0, 3));
        } else {
          setSubtitles([]);
        }
      } catch (err) {
        console.error("Error fetching subtitles:", err);
        setSubtitles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsReadyToSummarize(true);
    }
  };

  const handleSummarization = () => {
    if (uploadedFile) {
      navigate("/summarize", { state: { file: uploadedFile } });
    } else {
      alert("Please upload a subtitle file first.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!movie) return <p>No movie data found.</p>;

  return (
<div className="movie-details-container">
  <div className="movie-details">
    <div className="movie-header">
      <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
      <div className="movie-info">
        <h2>{movie.Title} ({movie.Year})</h2>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Writer:</strong> {movie.Writer}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
        <p><strong>IMDb Votes:</strong> {movie.imdbVotes}</p>
        <p><strong>Rated:</strong> {movie.Rated}</p>
        <p><strong>Runtime:</strong> {movie.Runtime}</p>
       </div>
    </div>

    <div className="movie-description">
      <h3>Plot</h3>
      <p>{movie.Plot}</p>
    </div>

 
  </div>

  <div className="summarize-details">
  <h3 className="upload-section-heading">Get English Subtitles for Summarization</h3>
  {subtitles.length > 0 ? (
    <>
      <p>Follow these steps to obtain subtitles:</p>
      <ol>
        <li>Click on one of the links below to download a subtitle file.</li>
        <li>Save the file on your device.</li>
        <li>Upload it below for summarization.</li>
      </ol>
      <ul>
        {subtitles.map((sub) => (
          <li key={sub.id}>
            <a
              href={`https://www.opensubtitles.com/en/subtitles/${sub.id}/buttons`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sub.attributes.release}
            </a>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p>No English subtitles found.</p>
  )}

  {/* Upload Section with Box */}
  <div className="upload-section">
    <h3 className="upload-section-heading">Upload Subtitle File for Summarization</h3>
    <input
      type="file"
      accept=".srt,.zip,.ssa,.vtt"
      onChange={handleFileUpload}
    />
    {uploadedFile && <p>✅ Uploaded: {uploadedFile.name}</p>}

    {isReadyToSummarize && (
      <button
        onClick={handleSummarization}
        className="summarize-button"
        disabled={!isReadyToSummarize}
      >
        Start Summarizing
      </button>
    )}
  </div>
</div>
</div>
  );
};

export default MovieDetails;