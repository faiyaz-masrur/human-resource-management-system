import React, { useState } from 'react';
// import api from '../../services/api'; // Keeping the original import commented out

const ChangePassword = () => {
  // State for the three required fields for a Change Password flow
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

    // --- API Logic Placeholder (using a simple delay to simulate API call) ---
    console.log('Attempting to change password...');
    
    // In a real app, you would uncomment and use your API client here:
    /*
    try {
        await api.put('/system/auth/change-password/', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });
        setMessage('Password updated successfully.');
    } catch (err) {
        console.error('Password change failed:', err.response.data);
        setError(err.response?.data?.old_password || err.response?.data?.detail || 'An error occurred.');
        return;
    }
    */
    
    // Simulate successful API response
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage('Password updated successfully.');

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="change-password-container">
      <div className="change-form-section">
        <div className="form-content">
          {/* Heading matches the three-field screenshot */}
          <h2>CHANGE PASSWORD</h2> 
          <form onSubmit={handleChangePassword}>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* 1. Old Password Field */}
            <div className="form-group password-group">
              <div><label htmlFor="oldPassword">Old Password</label></div>
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

            {/* 2. New Password Field */}
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

            {/* 3. Confirm Password Field */}
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
