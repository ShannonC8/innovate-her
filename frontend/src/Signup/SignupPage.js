import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { useUser} from "../UserContext"; 
import './SignupPage.css'; 


function SignupPage() {
  const [email, setEmail] = useState("");
  const { userId, setUser, setUserName } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUsername] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name == "userName") {
      setUsername(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); 

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", {
        email,
        password,
        userName,
      });
      console.log(response.data); 
      setUser(response.data.user_id);
      setUserName(response.data.user_name);
      navigate("/welcome");
    } catch (err) {
      console.error(err);
      setError("Failed to sign up. Please check your credentials.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-subtitle">Join Uplift for your health and fitness journey!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
        <div className="input-container">
            <label htmlFor="userName" className="input-label">Name</label>
            <input
              type="userName"
              id="userName"
              name="userName"
              value={userName}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
