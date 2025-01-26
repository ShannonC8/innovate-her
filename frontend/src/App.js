import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./Login/LoginPage"; 
import SignupPage from "./Signup/SignupPage";
import PeriodTracker from "./PeriodTracker/PeriodTracker";
import { UserProvider } from "./UserContext";
import Smile from "./Smile/Smile";
import ToDo from "./ToDo/ToDo";
import Sidebar from './Sidebar/Sidebar'; // Import Sidebar component
import WelcomePage from "./Welcome/welcome";
import "./App.css";

// Component to wrap app routes and handle sidebar visibility based on route
function AppRoutes() {
  const location = useLocation(); // Get current route location

  return (
    <div className="app-container">
      {/* Conditionally render Sidebar */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <Sidebar />}
      
      <div className="content">
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/calender" element={<PeriodTracker />} />
          <Route path="/smile" element={<Smile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes /> {/* The main Routes wrapper with conditional Sidebar */}
      </Router>
    </UserProvider>
  );
}

export default App;
