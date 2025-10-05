import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Accept toggle handlers as props
const Navbar = ({ onMenuClick, onRightPanelClick }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const currentTime = "11:34 AM";
    const currentDate = "24 Mar 2025";
    const activePage = "Dashboard";
    const menuTitle = "Menu";


    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

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
                    
                    <div className="user-profile" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
                        <div className="profile-image-container">
                            <img src="/avatar.png" alt="User" className="profile-image" />
                        </div>
                        <div className="profile-info" >
                            <span className="profile-welcome">Welcome</span>
                            <span className="profile-name">{user?.name}</span>
                        </div>
                        <span className="profile-dropdown-arrow">▼</span>
                        {dropdownOpen && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', borderRadius: 6, minWidth: 150, zIndex: 10 }}>
                            <button onClick={() => navigate('/change-password')}  style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 500, color: '#222', borderRadius: 6 }}>
                                Change Password
                            </button>
                            <button onClick={handleLogout} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 500, color: '#222', borderRadius: 6 }}>
                                Logout
                            </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default Navbar;
