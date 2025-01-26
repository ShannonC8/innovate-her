import React, { useEffect, useState } from 'react';
import './Smile.css'; // Import the CSS file for styling

const Smile = () => {
  const [quote, setQuote] = useState('Loading your motivational quote...');

  useEffect(() => {
    // Fetch the quote from the backend
    const fetchQuote = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/generate-quote');
        const data = await response.json();
        if (response.ok) {
          setQuote(data.quote);
        } else {
          setQuote('Sorry, something went wrong. Please try again later.');
        }
      } catch (error) {
        setQuote('Sorry, something went wrong. Please try again later.');
      }
    };

    fetchQuote();
  }, []);

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
        <p className="footer-text">{quote}</p>
      </div>
    </div>
  );
};

export default Smile;
