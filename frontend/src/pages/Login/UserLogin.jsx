import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SonaliLogo from "../../assets/sonali-logo.jpg";
import LoginImage from "../../assets/login_page_image.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const UserLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseURL}/system/auth/login/`, { 
        email, 
        password 
      });
      console.log("Login responce: ", response)
      await login(
        response.data.access,
        response.data.refresh
      );
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      let errorMsg = 'Login failed. Please check your credentials!';
      setError(errorMsg); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  };

  return (
    <div className="login-container">
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

      <div className="login-form-section">
        <div className="form-content">
          <h2>USER SIGN IN</h2>

          <form onSubmit={handleLogin}>
            {/* Error Message - This will persist now */}
            {error && (
              <div
                id="login-error-message"
                style={{
                  color: 'red',
                  fontSize: '0.9em',
                  marginBottom: '20px',
                  padding: '10px',
                 backgroundColor: '#ffe6e6',
                  borderRadius: '5px',
                  position: 'relative',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                    <FontAwesomeIcon icon={faFaceSadTear} 
                    
                    />
                <strong></strong> {error}
              </div>
            )}

            <div className="form-group">
              <label>Your Email ID</label>
              <input
                type="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group password-group">
              <label>Your Password</label>
              <input
                type="password"
                placeholder="•••••••••"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
                disabled={isSubmitting}
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>

            <div className="forgot-password">
              <a href="/forget-password">Forget Username, Password?</a>
              <span className="contact-admin">Contact System Admin</span>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="copyright">
            Copyright © 2025 Sonali Intellect Limited. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;