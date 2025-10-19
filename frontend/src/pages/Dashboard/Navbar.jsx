import { useState, useEffect } from 'react'; 
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 

const Navbar = ({ onMenuClick, onRightPanelClick }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); 

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const navigate = useNavigate();


    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const currentTime = currentDateTime.toLocaleTimeString('en-US', timeOptions);
    const currentDate = currentDateTime.toLocaleDateString('en-GB', dateOptions).replace(/ /g, ' ');

    const activePage = "Dashboard";
    const menuTitle = "Menu";

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('notifications/unread-count/');
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);


    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    const handleChangePass = () => {
        navigate('/change-password'); 
    };

    return (
        <div className="navbar-container">
            {/* 1. Mobile Menu Toggle */}
            <span className="navbar-toggle-left" onClick={onMenuClick}>
                <Menu size={20} />
            </span>

            {/* 2. Breadcrumbs */}
            <div className="navbar-left">
                <span className="breadcrumb">{menuTitle}</span>
                <span className="breadcrumb-separator">/</span> 
                <span className="breadcrumb-active">{activePage}</span>
            </div>

            {/* 3. Spacer */}
            <div className="navbar-spacer"></div>

            {/* 4. Right Section */}
            <div className="navbar-right">

                {/* Search Bar */}
                <div className="search-bar">
                    <span className="search-icon"><Search size={18} /></span>
                    <input type="text" placeholder="Search" />
                </div>

                {/* Date & Time */}
                <div className="datetime-group">
                    <span className="current-time">{currentTime}</span>
                    <span className="current-date">/ {currentDate}</span>
                </div>

                {/* 🔔 Notification Icon with Count */}
                <span className="notification-toggle" onClick={onRightPanelClick} style={{ position: 'relative' }}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: 'red',
                                color: 'white',
                                fontSize: '10px',
                                borderRadius: '50%',
                                padding: '2px 5px',
                                minWidth: '16px',
                                textAlign: 'center',
                            }}
                        >
                            {unreadCount}
                        </span>
                    )}
                </span>

                {/* User Profile */}
                <div className="user-profile" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
                    <div className="profile-image-container">
                        <img src="/avatar.png" alt="User" className="profile-image" />
                    </div>
                    <div className="profile-info">
                        <span className="profile-welcome">Welcome</span>
                        <span className="profile-name">{user?.name}</span>
                    </div>
                    <span className="profile-dropdown-arrow">▼</span>

                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '110%',
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            borderRadius: 6,
                            minWidth: 150,
                            zIndex: 10
                        }}>
                            <button
                                onClick={handleChangePass}
                                style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    color: '#222',
                                    borderRadius: 6
                                }}
                            >
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    color: '#222',
                                    borderRadius: 6
                                }}
                            >
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
