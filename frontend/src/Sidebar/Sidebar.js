import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Add styling in a separate CSS file if needed

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo container */}
      <div className="logo">
        <img src="/logo.png " alt="Logo" />
      </div>
      <ul>
        <li><Link to="/todo">To-Do</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/smile">Smile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
