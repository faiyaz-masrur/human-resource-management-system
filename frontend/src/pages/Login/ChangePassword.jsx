import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.put(
        'http://localhost:8000/api/auth/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error('Password change failed:', err.response.data);
      if (err.response && err.response.data) {
        setError(err.response.data.old_password || err.response.data.detail || 'An error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-image-section">
        <div className="overlay-circle"></div>
        <div className="human-resource-text">
          <h1>Human Resource Management System</h1>
        </div>
      </div>
      <div className="change-form-section">
        <div className="form-content">
          <h2>CHANGE PASSWORD</h2>
          <form onSubmit={handleChangePassword}>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group password-group">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <span className="password-toggle">
                <i className="fa fa-eye-slash"></i>
              </span>
            </div>
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

export default ChangePassword;