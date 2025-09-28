import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ForgetPasswordUpdate = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

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
      // Redirect to login after successful password reset
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
        <div className="overlay-circle"></div>
        <div className="human-resource-text">
          <h1>Human Resource Management System</h1>
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
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordUpdate;