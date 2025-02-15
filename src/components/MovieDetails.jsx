import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";

const API_KEY = "GZyDgiglxWR498vYHj7gtuC5diFwxRBR";

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
          // Filter only English subtitles and limit to 3 links
          const englishSubtitles = response.data.data
            .filter((sub) => sub.attributes.language === "en")
            .slice(0, 3);
          setSubtitles(englishSubtitles);
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

  // Handle file upload: when a user uploads a subtitle file, we mark the state ready for summarization.
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsReadyToSummarize(true);
    }
  };

  // When the user clicks "Start Summarizing", navigate to the Summarize page and pass the file via state.
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
        <h3>Get English Subtitles for Summarization</h3>
        {subtitles.length > 0 ? (
          <>
            <p>
              To obtain subtitles for this movie, follow these steps:
            </p>
            <ol>
              <li>
                Click on one of the subtitle links below to download the subtitle file.
              </li>
              <li>
                Save the subtitle file on your device.
              </li>
              <li>
                Upload the file using the uploader below to begin summarization.
              </li>
            </ol>
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
                    >
                      {sub.attributes.release}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>No English subtitles found.</p>
        )}

        {/* File Upload Section */}
        <h3>Upload Subtitle File for Summarization</h3>
        <p>
          After downloading the subtitle file, please upload it below:
        </p>
        <input type="file" accept=".srt,.zip,.ssa" onChange={handleFileUpload} />
        {uploadedFile && <p>✅ Uploaded: {uploadedFile.name}</p>}

        {/* Summarization Button */}
        {isReadyToSummarize && (
          <button onClick={handleSummarization} className="summarize-button">
            Start Summarizing
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
