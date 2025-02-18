import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Summarize.css";

const Summarize = () => {
  const location = useLocation();
  const chatEndRef = useRef(null);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]); // State for dynamic prompts

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  useEffect(() => {
    if (location.state?.file) {
      const reader = new FileReader();
      reader.onload = (e) => summarizeContent(e.target.result);
      reader.readAsText(location.state.file);
    }
  }, [location.state?.file]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const fetchAIResponse = async (prompt) => {
    try {
      // First, fetch response based on the subtitle
      const subtitleResponse = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      
      const subtitleResult = await subtitleResponse.json();
      let subtitleAnswer = subtitleResult?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
  
      // If subtitle-based answer seems insufficient, fetch additional context from the web
      if (subtitleAnswer.includes("I don't have enough information")) {
        const webPrompt = `Find relevant information about: ${prompt}`;
        const webResponse = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: webPrompt }] }],
          }),
        });
  
        const webResult = await webResponse.json();
        const webAnswer = webResult?.candidates?.[0]?.content?.parts?.[0]?.text || "No additional information found.";
  
        return `${subtitleAnswer}\n\nAdditional context from the web: ${webAnswer}`;
      }
  
      return subtitleAnswer;
    } catch {
      return "⚠️ An error occurred. Please try again later.";
    }
  };
  

  const summarizeContent = async (content) => {
    if (!content.trim()) {
      setError("⚠️ The file content is empty.");
      return;
    }
    setLoading(true);
    setError("");
    setIsChatVisible(false);

    const summaryText = await fetchAIResponse(`Summarize this movie subtitle:\n${content}`);
    setSummary(summaryText);
    setChat([{ role: "bot", text: summaryText }]);
    setLoading(false);
    setIsChatVisible(true);

    // Generate suggested prompts based on the summary
    generateSuggestedPrompts(summaryText);
  };

  const generateSuggestedPrompts = async (summary) => {
    const prompt = `Generate 5 relevant questions based on this movie summary and keep them short and don't number them:\n${summary}`;
    const promptsText = await fetchAIResponse(prompt);
    const promptsArray = promptsText.split("\n").filter((p) => p.trim()); // Split into array and remove empty lines
    setSuggestedPrompts(promptsArray);
  };

  const askQuestion = async (query) => {
    if (!query.trim()) return;
  
    const newChat = [...chat, { role: "user", text: query }];
    setChat(newChat);
    setQuestion("");
  
    const answerText = await fetchAIResponse(`Provide an answer based on the available subtitle data. If the subtitle lacks information, supplement with reliable web sources. Keep responses relevant, polite, and avoid repetition.
  
  Subtitle Data: ${summary}
  
  User question: ${query}`);
  
    // Format response to bold words wrapped in **
    const formattedAnswer = answerText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  
    setChat([...newChat, { role: "bot", text: formattedAnswer }]);
  };
  
  return (
    <div className="summarize-container">
      <header>
        <h1>🎬 Movie AI Assistant</h1>
        <p>Grab some popcorn! 🍿</p>
      </header>

      {loading && <div className="loading">🔄 Analyzing subtitles...</div>}
      {error && <div className="error">{error}</div>}

      {isChatVisible && (
        <>
          <div className="chat-window">
            {chat.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
  <div className="message-content">
    {msg.role === "bot" && <span className="ai-marker">🤖</span>}
    <p
      className="text-bubble"
      dangerouslySetInnerHTML={{ __html: msg.text }}
    ></p>
  </div>
</div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="suggested-prompts">
            <p>🔎 Suggested questions:</p>
            <div className="prompt-buttons">
              {suggestedPrompts.map((prompt, index) => (
                <button key={index} onClick={() => askQuestion(prompt)} className="prompt-btn">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="input-area">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question here... 💬"
              onKeyPress={(e) => e.key === "Enter" && !loading && askQuestion(question)}
              disabled={loading}
            />
            <button onClick={() => askQuestion(question)} disabled={!question.trim() || loading}>
              <span>Send 🚀</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Summarize;