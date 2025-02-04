import React from 'react';
import './difficulty.css';

const Difficulty = ({ setDifficulty }) => {
    console.log("Difficulty selected:", level);  // Log selected difficulty level
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
};

export default Difficulty;
