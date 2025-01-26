import React, { useState } from "react";
import axios from "axios"; 
import { useUser} from "../UserContext"; 
import './LoginPage.css'; 
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const navigate = useNavigate();
  const { userId, setUser, setUserName } = useUser(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email,
        password,
      });
      console.log(response.data); 
      setUser(response.data.user_id);
      setUserName(response.data.user_name);
      navigate("/todo");
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome to UpLift</h2>
        <p className="login-subtitle">Your personalized companion for fitness, health, and wellness!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" id="submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
