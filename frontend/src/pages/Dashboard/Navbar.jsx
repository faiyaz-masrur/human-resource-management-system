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
        <>
            <style>
                {`
                /* === Navbar Specific Styles === */
                .navbar-container {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    /* Changed from space-between to flex-start to allow the spacer to control positioning */
                    justify-content: flex-start;
                    align-items: center;
                    height: 60px;
                    padding: 0 25px;
                    background-color: white; /* White background */
                    border-bottom: 1px solid #e0e0e0; /* Subtle bottom border */
                    color: #333;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); /* Very light shadow */
                }

                /* --- New Spacer Element to push content right --- */
                .navbar-spacer {
                    flex-grow: 1; /* Takes up all available space */
                    min-width: 20px;
                }

                /* --- Left Section (Menu/Breadcrumbs) --- */
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    /* Removed fixed margin-left, position is now managed by the spacer */
                    margin-left: 0; 
                }
                .navbar-toggle-left {
                    /* Only visible on mobile, positioned absolute or fixed on mobile */
                    display: none; 
                    cursor: pointer;
                    padding: 5px;
                    color: #555;
                    font-size: 1.5rem;
                }
                @media (max-width: 768px) {
                    /* Show hamburger menu on mobile */
                    .navbar-toggle-left {
                         display: flex; 
                    }
                    /* Remove spacer on mobile to prevent empty space */
                    .navbar-spacer {
                        display: none;
                    }
                }
                @media (min-width: 769px) {
                    .navbar-toggle-left {
                        display: none; 
                    }
                }

                .breadcrumb {
                    font-size: 1rem;
                    color: #888;
                    font-weight: 400;
                }
                .breadcrumb-separator {
                    color: #ccc;
                    margin: 0 4px;
                }
                .breadcrumb-active {
                    font-size: 1rem;
                    color: #333;
                    font-weight: 500;
                }

                /* --- Right Section (Search Bar, Date/Time, Notifications, Profile) --- */
                .navbar-right {
                    display: flex;
                    align-items: center;
                    /* Add padding/margin to the right of the breadcrumbs group */
                    margin-left: 30px; 
                    gap: 15px; 
                }
                
                .search-bar {
                    width: 250px; 
                    display: flex;
                    align-items: center;
                    background-color: #f5f5f5; 
                    border-radius: 4px;
                    padding: 0 10px;
                    height: 38px;
                    transition: all 0.2s;
                }
                .search-bar:focus-within {
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
                }
                .search-icon {
                    color: #888;
                    margin-right: 8px;
                    display: flex;
                    align-items: center;
                }
                .search-bar input {
                    border: none;
                    background: transparent;
                    outline: none;
                    width: 100%;
                    font-size: 0.95rem;
                    color: #333;
                    padding: 0;
                }
                .search-bar input::placeholder {
                    color: #999;
                }

                .datetime-group {
                    display: flex;
                    align-items: center;
                    font-size: 0.9rem;
                    color: #666;
                    white-space: nowrap;
                }
                .current-time { font-weight: 500; }
                .current-date { font-weight: 400; margin-left: 5px; }

                .notification-toggle {
                    cursor: pointer;
                    color: #666;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }
                .notification-toggle:hover {
                    color: #007bff;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 5px 0;
                }
                .profile-image-container {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 1px solid #ddd;
                }
                .profile-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .profile-info {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }
                .profile-welcome { font-size: 0.75rem; color: #888; font-weight: 400; }
                .profile-name { font-size: 0.9rem; color: #333; font-weight: 500; }
                .profile-dropdown-arrow { font-size: 0.6rem; color: #666; }

                /* --- Responsive Adjustments --- */
                @media (max-width: 1024px) {
                    .search-bar { width: 200px; }
                    .navbar-right { gap: 10px; }
                }

                @media (max-width: 768px) {
                    .navbar-container {
                        justify-content: space-between; /* Revert to standard mobile layout */
                        padding: 0 15px;
                    }
                    .search-bar, .datetime-group {
                        display: none; /* Hide utility elements on mobile */
                    }
                    .navbar-right {
                        gap: 5px;
                    }
                    .navbar-left {
                        margin-left: 0;
                    }
                    .breadcrumb-separator, .breadcrumb {
                        display: none; 
                    }
                }
                `}
            </style>
            
            <div className="navbar-container">
                
                {/* 1. Mobile Menu Toggle (Hidden on Desktop) */}
                <span className="navbar-toggle-left" onClick={onMenuClick}>
                    <Menu size={20} />
                </span>
                
                {/* 2. SPACER: Takes up available space to push content right */}
                <div className="navbar-spacer"></div>

                {/* 3. Breadcrumbs (Starts near the center) */}
                <div className="navbar-left">
                    <span className="breadcrumb">{menuTitle}</span>
                    <span className="breadcrumb-separator">/</span> 
                    <span className="breadcrumb-active">{activePage}</span>
                </div>
                
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
        </>
    );
};

export default Navbar;
