import React, { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post('http://127.0.0.1:8000/api/system/auth/login/', {
        email,
        password,
      });

      login(response.data)

      navigate('/'); 

    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={LoginImage} className="login-page-img" />
        <img src={SonaliLogo} className="logo-img-login" />
        
        <div className="human-resource-text">
          <h1>Human Resource Management System</h1>
        </div>
      </div>

      <div className="login-form-section">
        <div className="form-content">
          <h2 className="form-header h2">USER SIGN-IN</h2>
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                type="email"
                id="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>
            <div className="forgot-password">
              <a href="/forget-password">Forgot username, Password?</a>
              <span className="contact-admin">Contact System Admin</span>
            </div>
            <button type="submit" className="login-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
