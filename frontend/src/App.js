import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage"; 
import "./App.css"; 
import SignupPage from "./Signup/SignupPage";
import PeriodTracker from "./PeriodTracker/PeriodTracker"
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider> 
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/calender" element={<PeriodTracker/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
