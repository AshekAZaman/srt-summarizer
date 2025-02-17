import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Summarize.css";

const Summarize = () => {
  const location = useLocation();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const chatEndRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  useEffect(() => {
    if (location.state?.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        summarizeContent(e.target.result);
      };
      reader.readAsText(location.state.file);
    }
  }, [location.state?.file]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const summarizeContent = async (content) => {
    setLoading(true);
    setError("");

    if (!content.trim()) {
      setError("⚠️ The file content is empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Summarize this movie subtitle:\n${content}` }] }],
        }),
      });

      const result = await response.json();
      const summaryText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "📝 No summary available.";
      setSummary(summaryText);
      setChat([{ role: "bot", text: summaryText }]);
    } catch (err) {
      setError("⚠️ Failed to summarize content. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const newChat = [...chat, { role: "user", text: question }];
    setChat(newChat);
    setQuestion("");

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Based on the summary:\n${summary}\n\nUser question: ${question}` }] }],
        }),
      });

      const result = await response.json();
      const answerText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "💬 No answer available.";
      setChat([...newChat, { role: "bot", text: answerText }]);
    } catch (err) {
      setChat([...newChat, { role: "bot", text: "⚠️ Failed to get an answer. Try again later." }]);
    }
  };

  return (
    <div className="summarize-container">
      <div className="header">
        <h1>🎬 Movie AI Assistant</h1>
        <p>Ask anything about the movie plot! 🎥</p>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing subtitles...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="chat-window">
        {chat.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.role === 'bot' && <div className="ai-marker">🤖</div>}
              <div className="text-bubble">
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question here... 💬"
          onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
        />
        <button onClick={askQuestion} disabled={!question.trim()}>
          <span>Send 🚀</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Summarize;
