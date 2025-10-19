import React, { useState } from 'react';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import SonaliLogo from "../../assets/sonali-logo.jpg";
import LoginImage from "../../assets/login_page_image.png";

const ForgetPasswordUpdate = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { uid, token } = useParams();
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }

    try {
      const response = await api.post(`/system/auth/reset-password/${uid}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(response.data.detail);
      navigate('/login/user');

    } catch (err) {
      console.error('Password update failed:', err.response.data);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'An error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-image-section">
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
      <div className="update-form-section">
        <div className="form-content">
          <h2>UPDATE PASSWORD</h2>
          <form onSubmit={handleUpdate}>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div className="form-group password-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>
            
            <button type="submit" className="update-button">Update</button>
          </form>
          
          <div className="copyright">
            Copyright © 2025 Sonali Intellect Limited. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordUpdate;