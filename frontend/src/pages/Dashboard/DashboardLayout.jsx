import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Layout components
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationSidebar from './NotificationSidebar';

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

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

  // Prevent body scroll when panels are open on mobile
  useEffect(() => {
    if (showSidebar || showRightPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar, showRightPanel]);

  return (
    <div className="dashboard-layout">
      {/* Navbar with click handlers to toggle the sidebars */}
      <Navbar
        onMenuClick={() => setShowSidebar(v => !v)}
        onRightPanelClick={() => setShowRightPanel(v => !v)}
      />
      {/* Left Sidebar, conditionally shown */}
      <Sidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
      
      <main className="main-content">
        {/* The Outlet renders the current nested route's component */}
        <Outlet />
      </main>
      
      {/* Right Notification Sidebar, conditionally shown */}
      <NotificationSidebar
        show={showRightPanel}
        onClose={() => setShowRightPanel(false)}
      />

      {/* Panel overlay for mobile, to close panels when clicked outside */}
      <div
        className={`panel-overlay${showSidebar || showRightPanel ? ' active' : ''}`}
        onClick={handleOverlayClick}
      />
    </div>
  );
};

export default DashboardLayout;