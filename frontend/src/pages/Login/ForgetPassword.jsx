import React, { useState } from "react";
import apiWithoutAuth from "../../services/apiWithoutAuth"; // CHANGE THIS LINE
import SonaliLogo from "../../assets/sonali-logo.jpg";
import LoginImage from "../../assets/login_page_image.png";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setMessage("");
    
    try {
      // Use apiWithoutAuth instead of api
      const response = await apiWithoutAuth.post("/system/auth/reset-password/", { 
        email: email 
      });

      console.log("API Response:", response);
      
      if (response.status === 200 || response.status === 201) {
        setMessage(response.data?.message || "Password reset link sent to your email.");
      } else {
        setMessage(response.data?.message || "Unable to send reset email. Try again.");
      }
    } catch (error) {
      console.error('Password reset error details:', error);
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          setMessage("Password reset service not found. Please contact support.");
        } else if (error.response.status === 400) {
          setMessage(error.response.data?.email?.[0] || 
                    error.response.data?.message || 
                    "Invalid email address or user not found.");
        } else if (error.response.status === 500) {
          setMessage("Server error. Please try again later.");
        } else {
          const errorMessage = error.response.data?.message || 
                              error.response.data?.error ||
                              `Error: ${error.response.status}`;
          setMessage(errorMessage);
        }
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={LoginImage} alt="Background" className="login-page-img" />
        <img src={SonaliLogo} alt="Logo" className="logo-img-login" />
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
          <h2>FORGET PASSWORD</h2>
          
          <div>
            <div className="form-group">
              <label>Your Email ID</label>
              <input
                type="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={{ 
                  transform: 'translateY(-10px)',
                  marginBottom: '15px',
                  padding: '10px 12px',
                  fontSize: '0.76em',
                  letterSpacing: '0.001em'
                }}
              />
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "SUBMIT"}
            </button>
            
            {message && (
              <p style={{ 
                marginTop: "20px", 
                color: message.includes("sent") || message.includes("Success") || message.includes("reset") ? "#2e7d32" : "#d32f2f",
                textAlign: "center",
                fontSize: "0.9em",
                padding: "10px",
                backgroundColor: message.includes("sent") || message.includes("Success") || message.includes("reset") ? "#f1f8e9" : "#ffebee",
                borderRadius: "4px"
              }}>
                {message}
              </p>
            )}

            {/* Back to Login link */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <a 
                href="/login" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontSize: '0.9em'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>

        <div className="copyright">
          Copyright © 2025 Sonali Intellect Limited. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;