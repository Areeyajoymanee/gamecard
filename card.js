import React from "react";
import "./card.css";

const Card = ({ card, onClick, isFlipped }) => {
  
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`} // Add 'flipped' class if the card is flipped
      onClick={() => onClick(card.id)}
    >
      <div className="card-inner">
        {/* Front of the card */}
        <div className="card-front">
          ?
        </div>

        {/* Back of the card */}
        <div className="card-back">
          <img src={card.src} alt={`Card ${card.id}`} />
        </div>
      </div>
    </div>
  );
};

export default Card;
