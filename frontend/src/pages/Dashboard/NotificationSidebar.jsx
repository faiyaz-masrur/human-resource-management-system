// NotificationSidebar.jsx
import React from 'react';

const notifications = [
  { title: 'New office order', time: 'Just now' },
  { title: 'New office order', time: '59 minutes ago' },
  { title: 'New office order', time: '12 hours ago' },
  { title: 'New office order', time: 'Today, 11:59 AM' },
  { title: 'New office order', time: '14 Jan 2025, 11:59 AM' },
];

// Accept className and onClose
const NotificationSidebar = ({ className, onClose }) => {
  return (
    <div className={className}>
      <div className="notification-header">
        <h2 className="header-title">Notifications</h2>
        <a href="#" className="header-link">See all</a>
        {/* Optional: Add a close button for mobile/overlay view */}
      </div>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <div className="notification-icon">
              <span>✉️</span>
            </div>
            <div className="notification-content">
              <p className="notification-title">{notification.title}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSidebar;