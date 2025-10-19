import React, { useState } from "react";
import api from "../../services/api";
import SonaliLogo from "../../assets/sonali-logo.jpg";
import LoginImage from "../../assets/login_page_image.png";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/system/auth/forgot-password/", { email });
      setMessage(response.data?.message || "Password reset link sent to your email.");
    } catch {
      setMessage("Unable to send reset email. Try again.");
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
          <form onSubmit={handleSubmit}>
            {/* Email Field with closer spacing */}
            <div className="form-group">
              <label>Your Email ID</label>
              <input
                type="email"
                placeholder="Example: abc@sonaliintellect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required

                style={{ transform: 'translateY(-10px)',
                  marginBottom: '15px',
                  padding: '10px 12px',
                  fontSize: '0.76em',
                  letterSpacing: '0.001em'
                }}
              />
            </div>

            <button type="submit" className="login-button">SUBMIT</button>
            {message && <p style={{ marginTop: "20px", color: "#333" }}>{message}</p>}
          </form>
        </div>

        {/* Copyright - EXACT POSITION */}
        <div className="copyright">
          Copyright © 2025 Sonali Intellect Limited. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;