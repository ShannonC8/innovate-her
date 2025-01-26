import React from 'react';
import './Smile.css'; // Import the CSS file for styling

const Smile = () => {
  return (
    <div className="smile-container">
      <div className="text-section">
        <h1 className="main-title">Let's Smile and Be Happy!</h1>
        <p className="motivational-text">Studies show that smiling not only makes you happier but also boosts your overall well-being!</p>
      </div>

      <div className="video-section">
        <img 
          src="http://127.0.0.1:5000/video_feed" 
          alt="Facial landmarks detection" 
          className="video-feed" 
        />
      </div>

      <div className="footer">
        <p className="footer-text">Smile :) It's good for you!</p>
      </div>
    </div>
  );
};

export default Smile;
