import React from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import './Sidebar.css'; // Add styling in a separate CSS file if needed
import logo from './logo.png'

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo container */}
      
      <ul>
        <li><Link to="/todo">To-Do</Link></li>
        <li><Link to="/calender">Calendar</Link></li>
        <li><Link to="/smile">Smile</Link></li>
      </ul>
      {/* Spline mascot */}
      {/* require npm install @splinetool/react-spline @splinetool/runtime */}
      <div className="spline-container">
      <Spline scale={[1,1,1]} scene="https://prod.spline.design/nHB6VGUdXILVR-YO/scene.splinecode" />
      </div>
    </div>
  );
};

export default Sidebar;
