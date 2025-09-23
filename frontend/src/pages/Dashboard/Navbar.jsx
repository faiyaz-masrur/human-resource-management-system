import React from 'react';

const Navbar = () => {
  // Placeholder for the user's profile picture
  const userProfileImage = "path/to/profile-pic.jpg";

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <span className="breadcrumb">Menu</span>
        <span className="breadcrumb">|</span>
        <span className="breadcrumb-active">Dashboard</span>
      </div>
      
      <div className="navbar-center">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="navbar-right">
        <span className="current-time">11:34 AM</span>
        <span className="current-date">/ 24 Mar 2025</span>
        <div className="user-profile">
          <div className="profile-image-container">
            <img src={userProfileImage} alt="User" className="profile-image" />
          </div>
          <div className="profile-info">
            <span className="profile-welcome">Welcome</span>
            <span className="profile-name">MSH Pulak</span>
          </div>
          <span className="profile-dropdown-arrow">▼</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;