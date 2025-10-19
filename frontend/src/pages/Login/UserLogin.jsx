import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SonaliLogo from "../../assets/sonali-logo.jpg";
import LoginImage from "../../assets/login_page_image.png";

const UserLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/system/auth/login/', {
        email,
        password,
      });

      login(response.data)
      navigate('/'); 

    } catch (err) {
      console.error('Login failed:', err.response.data);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Blue Background with Image */}
      <div className="login-image-section">
        <img src={LoginImage} className="login-page-img" alt="Background" />
        <img src={SonaliLogo} className="logo-img-login" alt="Sonali Intellect" />
        
        <div className="human-resource-text">
        <h1>
          Human <br />
          Resource <br />
          Management <br />
          System
        </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="form-content">
          {/* Header - EXACT MATCH */}
          <h2>USER SIGN IN</h2>
          
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red', fontSize: '0.9em', marginBottom: '20px' }}>{error}</p>}
            
            {/* Email Field - EXACT MATCH */}
            <div className="form-group">
              <label>Your Email ID</label>
              <input
                type="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field - EXACT MATCH */}
            <div className="form-group password-group">
              <label>Your Password</label>
              <input
                type="password"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>

            {/* Forgot Password - SIDE BY SIDE */}
            <div className="forgot-password">
              <a href="/forget-password">Forget Username, Password?</a>
              <span className="contact-admin">Contact System Admin</span>
            </div>

            {/* Sign In Button - CENTERED */}
            <button type="submit" className="login-button">Sign In</button>
          </form>
          
          {/* Copyright - EXACT POSITION */}
          <div className="copyright">
            Copyright © 2025 Sonali Intellect Limited. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;