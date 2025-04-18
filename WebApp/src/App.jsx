import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import logo from "./assets/logo.png";
import "./App.css";

import analyzingAnim from "./animations/analyzing.json";
import successAnim from "./animations/success.json";
import errorAnim from "./animations/error.json";

// Nutritionix credentials
const NUTRITIONIX_APP_ID = "0c68c1ee";
const NUTRITIONIX_API_KEY = "a5e68a32f65be1d95e6e4345aa736c52";

// Hugging Face API endpoints
const FOOD_API_URL = "https://jatin1233232-food-classifier-api.hf.space/predict/food";
const FRUIT_API_URL = "https://jatin1233232-food-classifier-api.hf.space/predict/fruit";

function Section({ title, apiUrl }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleFile = useCallback((f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setPrediction(null);
    setNutrition(null);
    setError(false);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e) => e.preventDefault();

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const label = response.data.prediction[0];
      setPrediction(label);

      const nutriRes = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: label },
        {
          headers: {
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      setNutrition(nutriRes.data.foods[0]);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>{title} Analiz</h2>

      <div
        className="upload-area"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => document.getElementById(title).click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="preview" />
        ) : (
          <p className="upload-text">
            <strong>Drag & Drop</strong> or{" "}
            <span className="browse-text">Click to Browse</span>
          </p>
        )}
        <input
          id={title}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          style={{ display: "none" }}
        />
      </div>

      {preview && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="analyze-btn"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </motion.button>
      )}

      {loading && (
        <div className="loader">
          <Player autoplay loop src={analyzingAnim} style={{ height: "120px" }} />
        </div>
      )}

      {!loading && prediction && !error && (
        <div className="result">
          <Player autoplay loop src={successAnim} style={{ height: "80px" }} />
          <h3>🧠 Prediction</h3>
          <p>{prediction.charAt(0).toUpperCase() + prediction.slice(1)}</p>
        </div>
      )}

      {error && (
        <div className="result error">
          <Player autoplay loop src={errorAnim} style={{ height: "80px" }} />
          <h3>Something went wrong</h3>
        </div>
      )}

      {!loading && nutrition && (
        <div className="nutrition">
          <h3>🍽️ Nutritions</h3>
          <ul className="nutr-ul">
            <li>Calories: {nutrition.nf_calories} kcal</li>
            <li>Protein: {nutrition.nf_protein} g</li>
            <li>Fat: {nutrition.nf_total_fat} g</li>
            <li>Carbs: {nutrition.nf_total_carbohydrate} g</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("food");
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800); // 1.8 sec splash
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loader">
        <Player autoplay loop src={analyzingAnim} style={{ height: "150px" }} />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`app ${theme}`}>
      <header className="logo-container">
        <img src={logo} alt="App Logo" className="app-logo" />
        <h1 className="app-title">Analiz</h1>
      </header>

      <nav className="tabs">
        <button
          className={`tab-button ${activeTab === "food" ? "active" : ""}`}
          onClick={() => setActiveTab("food")}
        >
          🍛 Food
        </button>
        <button
          className={`tab-button ${activeTab === "fruit" ? "active" : ""}`}
          onClick={() => setActiveTab("fruit")}
        >
          🍎 Fruit
        </button>
        <button className="toggle-mode" onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </nav>

      <main>
        {activeTab === "food" && <Section title="Food" apiUrl={FOOD_API_URL} />}
        {activeTab === "fruit" && <Section title="Fruit" apiUrl={FRUIT_API_URL} />}
      </main>
    </div>
  );
}
