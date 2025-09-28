import React, { useState } from 'react';
import api from '../services/api';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/system/auth/reset-password/', { email });
      setMessage(response.data.detail);
    } catch (err) {
      console.error('Password reset request failed:', err.response.data);
      if (err.response && err.response.data) {
        setError(err.response.data.email[0] || 'An error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="password-recovery-container">
      <div className="recovery-image-section">
        <div className="overlay-circle"></div>
        <div className="human-resource-text">
          <h1>Human Resource Management System</h1>
        </div>
      </div>
      <div className="recovery-form-section">
        <div className="form-content">
          <h2>FORGET PASSWORD</h2>
          <form onSubmit={handleSubmit}>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Your Email ID</label>
              <input
                type="email"
                id="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;