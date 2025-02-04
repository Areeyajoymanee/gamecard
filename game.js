import React, { useState, useEffect } from "react";
import { usePlayer } from './PlayerContext'; // Import the usePlayer hook
import Card from "./api/card"; // Import the Card component
import "./api/card.css";

const initialTimes = { easy: 60, medium: 120, hard: 180 };

const MemoryGame = ({ difficulty }) => {
  const { playerName } = usePlayer(); // Access player name from context
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimes[difficulty]);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [apiImages, setApiImages] = useState([]); // For images from API

  // Fetch leaderboard and images from API
  useEffect(() => {
    const fetchLeaderboard = async (score) => {
      try {
        const response = await fetch('http://localhost:3001/leaderboard');
        if (!response.ok) {
          // เพิ่มการแสดงข้อความข้อผิดพลาด
          throw new Error(`Failed to fetch leaderboard. Status: ${response.status}`);
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        alert('Failed to fetch leaderboard. Please check your server connection.');
      }
    };
    
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:3001/cardimages");
        if (!response.ok) {
          throw new Error(`Failed to fetch card images. Status: ${response.status}`);
        }
        const data = await response.json();
        setApiImages(data);
      } catch (error) {
        console.error("Error fetching card images:", error);
        alert("Failed to fetch card images. Please check your server connection.");
      }
    };

    fetchLeaderboard();
    fetchCards();
  }, []);

  useEffect(() => {
    if (gameStarted && matchedCards.length === cards.length / 2 && cards.length > 0) {
      setGameWon(true);
    }
  }, [matchedCards, cards]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameWon) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameWon, gameStarted]);

  useEffect(() => {
    if (gameWon) {
      saveToLeaderboard();
    }
  }, [gameWon]);

  const startGame = () => {
    setGameStarted(true); // Mark the game as started
    setCards(getCardsByDifficulty(difficulty)); // Fetch the cards based on the difficulty
    setFlippedCards([]); // Reset flipped cards
    setMatchedCards([]); // Reset matched cards
    setAttempts(0); // Reset attempts
    setGameWon(false); // Reset win condition
    setGameOver(false); // Reset game over state
    setTimeLeft(initialTimes[difficulty]); // Reset timer based on difficulty
  };

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || flippedCards.includes(id) || matchedCards.includes(id) || gameOver) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setAttempts((prev) => prev + 1);
      const [first, second] = newFlippedCards;
      const firstCard = cards.find((card) => card.id === first);
      const secondCard = cards.find((card) => card.id === second);

      if (firstCard.src === secondCard.src) {
        setMatchedCards([...matchedCards, firstCard.src]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const getCardsByDifficulty = (level) => {
    let selectedCards = [...(apiImages.length ? apiImages : [])];
    const pairs = level === "easy" ? 8 : level === "medium" ? 18 : 32;

    // Ensure we have enough images to create pairs
    while (selectedCards.length < pairs) {
      selectedCards.push(...selectedCards);
    }

    // Shuffle and return cards
    return [...selectedCards.slice(0, pairs), ...selectedCards.slice(0, pairs)]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
  };

  const saveToLeaderboard = () => {
    if (!playerName.trim()) return;

    const newEntry = { name: playerName, timeLeft, attempts };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.timeLeft - a.timeLeft)
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);

    const saveLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3001/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry),
        });

        if (!response.ok) throw new Error('Failed to save leaderboard entry');
        const data = await response.json();
        console.log('Leaderboard entry saved:', data);
      } catch (error) {
        console.error('Error saving leaderboard entry:', error);
      }
    };

    saveLeaderboard();
  };

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <p>Welcome, {playerName}!!!</p>

      {!gameStarted ? (
        <button onClick={startGame} className="start-btn animate__animated animate__rubberBand">
          Start Game
        </button>
      ) : (
        <>
          <p>Attempts: {attempts} | Time Left: {timeLeft}s</p>

          <div className={`card-grid ${difficulty === "easy" ? "grid-4x4" : difficulty === "medium" ? "grid-6x6" : "grid-8x8"}`}>
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={handleCardClick}
                isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.src)}
              />
            ))}
          </div>

          {gameWon && (
            <div className="win-message">
              🎉 You won with {timeLeft} seconds left! 🎉
              <br />
              <button onClick={startGame} className="restart-btn">Restart</button>
            </div>
          )}

          {gameOver && !gameWon && (
            <div className="lose-message">
              ⏳ Time's up! Try again.
              <br />
              <button onClick={startGame} className="restart-btn">Restart</button>
            </div>
          )}
        </>
      )}

      <div className="leaderboard">
        <h2>🏆 Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.timeLeft}s</td>
                <td>{entry.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemoryGame;
