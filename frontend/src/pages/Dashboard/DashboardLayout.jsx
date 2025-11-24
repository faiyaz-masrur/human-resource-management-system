// DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';


// Layout components
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationSidebar from './NotificationSidebar';

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = (newVal) => {
    setUnreadCount(newVal);
  };

  // Toggle handlers
  const toggleSidebar = () => setShowSidebar(v => !v);
  const toggleRightPanel = () => setShowRightPanel(v => !v);

  // Close panels when clicking on overlay
  const handleOverlayClick = () => {
    setShowSidebar(false);
    setShowRightPanel(false);
  };

  // Close panels when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSidebar(false);
        setShowRightPanel(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Prevent body scroll when panels are open
  useEffect(() => {
    if (showSidebar || showRightPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      // Use a brief timeout to let CSS transitions finish before resetting overflow
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar, showRightPanel]);

  return (
    <div className="dashboard-layout">
      
      
      {/* The className prop is crucial for applying the 'show' state to the sidebars */}
      <Sidebar
        className={`sidebar-container ${showSidebar ? 'show' : ''}`}
        onClose={() => setShowSidebar(false)}
      />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <NotificationSidebar
        className={`notification-sidebar ${showRightPanel ? 'show' : ''}`}
        onClose={() => setShowRightPanel(false)}
        unreadCount={unreadCount}
        updateUnreadCount={updateUnreadCount}
      />

      <Navbar
        onMenuClick={toggleSidebar}
        unreadCount={unreadCount}
        updateUnreadCount={updateUnreadCount}
      />

      {/* Panel overlay for mobile/overlay mode */}
      <div
        className={`panel-overlay${showSidebar || showRightPanel ? ' active' : ''}`}
        onClick={handleOverlayClick}
      />
    </div>
  );
};

export default DashboardLayout;