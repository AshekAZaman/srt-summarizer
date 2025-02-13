import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SearchResults from "./components/SearchResults.jsx"; 
import MovieDetails from "./components/MovieDetails.jsx"; // Import MovieDetails

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetails />} /> {/* Add MovieDetails route */}
      </Routes>
    </Router>
  </React.StrictMode>
);
