import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ForgetPasswordUpdate = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get uid and token from URL query parameters
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

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
    setIsLoading(true);

    // Check if we have the required parameters
    if (!uid || !token) {
      setError('Invalid reset link. Please request a new password reset.');
      setIsLoading(false);
      return;
    }

    console.log("Password reset attempt:", { uid, token });

    // Frontend validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password don't match.");
      setIsLoading(false);
      return;
    }

    // REAL API CALL - Using axios directly (NO auto-redirects)
    try {
      const response = await axios.post(
        //http://172.17.231.72:8005/api/system/auth/reset-password/${uid}/${token}/
        `http://127.0.0.1:8000/api/system/auth/reset-password/${uid}/${token}/`, 
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(" Password reset successful:", response.data);
      setMessage(response.data.detail || 'Password reset successfully!');
      
      // NO AUTO-REDIRECT - User stays on page and clicks manually
      
    } catch (err) {
      console.error('❌ Password update failed:', err);
      
      // Better error handling
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        setError(
          errorData.detail || 
          errorData.new_password?.[0] ||
          errorData.non_field_errors?.[0] ||
          'An error occurred. Please try again.'
        );
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="update-password-container">
      <div className="update-form-section">
        <div className="form-content">
          {/* Fixed heading - single line and centered */}
          <h2 style={{ textAlign: 'center'}}>UPDATE PASSWORD</h2>
          
          <form onSubmit={handleUpdate}>
            {message && (
              <div style={{ 
                color: 'green', 
                textAlign: 'center', 
                 whiteSpace: 'nowrap',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f1f8e9',
                borderRadius: '4px'
              }}>
                <p style={{ fontWeight: 'bold' }}> {message}</p>
                <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
                  You can now login with your new password.
                </p>
              </div>
            )}
            
            {error && (
              <div style={{ 
                color: 'red', 
                textAlign: 'center', 
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#ffebee',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}
            
            <div className="form-group password-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                disabled={isLoading || message} // Disable if success
              />
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                disabled={isLoading || message} // Disable if success
              />
            </div>
            
<button 
  type="submit" 
  className="update-button"
  disabled={isLoading || message}
  style={{
    backgroundColor: message ? '#6c757d' : '#1976d2', // Blue background like in image
    color: 'white',
    cursor: message ? 'not-allowed' : 'pointer',
    width: '40%',
    padding: '14px',
     border: 'none',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap', // This forces text to stay on one line
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: '30%'
  }}
>
  {isLoading ? 'Updating...' : message ? 'Password Updated' : 'Update Password'}
</button>

            {/* Manual Back to Login Link - Always visible */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                  cursor: 'pointer',
                  padding: '5px 10px'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordUpdate;