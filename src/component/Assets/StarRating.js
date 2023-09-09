// StarRating.js
import React, { useState } from 'react';
import './StarRating.css'; // Import your CSS file

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleMouseEnter = (hoveredRating) => {
    if (onRatingChange) {
      setHoveredRating(hoveredRating);
    }
    
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoveredRating(null);
    }
    
  };

  const handleClick = (selectedRating) => {
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const renderStar = (starIndex) => {
    const filled = starIndex <= (hoveredRating || rating);

    return (
      <span
        key={starIndex}
        className={`star ${filled ? 'filled' : ''}`}
        onMouseEnter={() => handleMouseEnter(starIndex)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starIndex)}
      >
        &#9733;
      </span>
    );
  };

  const stars = Array.from({ length: 5 }, (_, i) => renderStar(i + 1));

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
