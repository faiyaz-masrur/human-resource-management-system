import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

// Accept toggle handlers as props
const Navbar = ({ onMenuClick, onRightPanelClick }) => {
    // Mock image path and user data to match the screenshot style
    const userProfileImage = "https://placehold.co/40x40/007bff/ffffff?text=U"; 
    const userName = "MSH Pulak";
    const currentTime = "11:34 AM";
    const currentDate = "24 Mar 2025";
    const activePage = "Dashboard";
    const menuTitle = "Menu";

    return (
        <div className="navbar-container">
            
            {/* 1. Mobile Menu Toggle (Hidden on Desktop) */}
            <span className="navbar-toggle-left" onClick={onMenuClick}>
                <Menu size={20} />
            </span>
            
            {/* 2. Breadcrumbs (MOVED TO THE LEFT) */}
            <div className="navbar-left">
                <span className="breadcrumb">{menuTitle}</span>
                <span className="breadcrumb-separator">/</span> 
                <span className="breadcrumb-active">{activePage}</span>
            </div>
            
            {/* 3. SPACER: Takes up available space to push content right (MOVED TO THE RIGHT) */}
            <div className="navbar-spacer"></div>
            
            {/* 4. Right Section (Utilities and Profile) */}
            <div className="navbar-right">
                
                {/* Search Bar */}
                <div className="search-bar">
                    <span className="search-icon">
                        <Search size={18} />
                    </span>
                    <input type="text" placeholder="Search" />
                </div>

                <div className="datetime-group">
                    <span className="current-time">{currentTime}</span>
                    <span className="current-date">/ {currentDate}</span>
                </div>
                
                {/* Notification Icon for Right Panel Toggle */}
                <span className="notification-toggle" onClick={onRightPanelClick}>
                    <Bell size={20} />
                </span>
                
                <div className="user-profile">
                    <div className="profile-image-container">
                        <img src={userProfileImage} alt="User" className="profile-image" />
                    </div>
                    <div className="profile-info">
                        <span className="profile-welcome">Welcome</span>
                        <span className="profile-name">{userName}</span>
                    </div>
                    <span className="profile-dropdown-arrow">▼</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
