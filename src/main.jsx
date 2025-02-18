import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter, no basename, no redirect
import "./index.css";
import App from "./App.jsx";
import SearchResults from "./components/SearchResults.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import Summarize from "./components/Summarize.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/summarize" element={<Summarize />} />
      </Routes>
    </Router>
  </React.StrictMode>
);