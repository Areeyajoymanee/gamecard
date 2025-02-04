'use client'; 
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { PlayerProvider, usePlayer } from './PlayerContext'; 
import Game from './game'; 
import Difficulty from "./Difficulty";
// หน้าเข้าสู่ระบบให้ผู้ใช้กรอกชื่อ
function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setPlayerName } = usePlayer();  // ใช้ context ในการจัดการชื่อผู้เล่น

  const handleSubmit = () => {
    console.log("Name entered:", name);  // Log the entered name
    setPlayerName(name);  // เก็บชื่อผู้เล่นใน context
    navigate('/difficulty');  // ไปที่หน้าเลือกระดับความยาก
    console.log("Navigating to difficulty page...");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// หน้าเลือกระดับความยาก
function DifficultyPage({ setDifficulty }) {
  const navigate = useNavigate();

  const handleDifficultySelect = (level) => {
    setDifficulty(level);  // ตั้งค่าระดับความยาก
    navigate('/game');  // ไปที่หน้าการเล่นเกม
  };

  return (
    <div className="difficulty-container">
  <h1>LEVEL</h1>
  <button 
    onClick={() => handleDifficultySelect("easy")}
    className="easy"
  >
    Easy
  </button>
  <button 
    onClick={() => handleDifficultySelect("medium")}
    className="medium"
  >
    Medium
  </button>
  <button 
    onClick={() => handleDifficultySelect("hard")}
    className="hard"
  >
    Hard
  </button>
</div>

  );
}

function App() {
  const [difficulty, setDifficulty] = useState("easy"); 

  return (
    <PlayerProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/difficulty" element={<DifficultyPage setDifficulty={setDifficulty} />} /> 
          <Route path="/game" element={<Game difficulty={difficulty} />} /> 
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;
