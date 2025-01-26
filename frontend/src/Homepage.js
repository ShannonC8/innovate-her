import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Import the CSS file
import logo from './logo.png'; // Import the logo image

const MainPage = () => {
  return (
    <div className="mainbackground">
      <div className="uplifting-container">
        {/* Logo container */}
        <img className="logo" src={logo} alt="Uplift Logo" />

        <div className="slogan">EASY, ENCOURAGING, EMBRACING</div>
      </div>
      
      <div className="button-container">
        <Link to="/signup">
          <button className="btn">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="btn">Login</button>
        </Link>

      </div>
    </div>
  );
};

export default MainPage;
