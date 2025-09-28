// NotificationSidebar.jsx
import React from 'react';

const notifications = [
  { title: 'New office order', time: 'Just now' },
  { title: 'New office order', time: '59 minutes ago' },
  { title: 'New office order', time: '12 hours ago' },
  { title: 'New office order', time: 'Today, 11:59 AM' },
  { title: 'New office order', time: '14 Jan 2025, 11:59 AM' },
];

// -----------------------------------------------------
// 1. Define Inline Style Objects
// -----------------------------------------------------

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#fff',
    height: '100%',
    padding: '20px',
    boxShadow: '-1px 0 4px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'static',
    zIndex: 10,
  },
  
  header: {
    // Mimicking justify-content: space-between using flex
    display: 'flex',
    justifyContent: 'flex-start', // Align items to the start
    gap: '45px', // Add gap between title and link
    alignItems: 'center',
    marginBottom: '20px',
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    margin: 0, // Ensure no default margin
  },

  headerLink: {
    fontSize: '14px',
    color: '#1890ff',
    textDecoration: 'none',

  },

  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },

  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    
    // Using padding for the "near center" effect
    paddingLeft: '10px', 
    position: 'relative',
    // NOTE: The purple marker (::before) CANNOT be implemented here.
  },

  notificationIcon: {
    // Creating space between the icon and content
    marginRight: '10px',
  },

  notificationContent: {
    display: 'flex',
    flexDirection: 'column',
  },

  notificationTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
    margin: '0 0 4px 0',
  },

  notificationTime: {
    fontSize: '12px',
    color: '#999',
  },
};

// Accept className and onClose
const NotificationSidebar = ({ className, onClose }) => {
  return (
    // -----------------------------------------------------
    // 2. Apply Inline Style Objects
    // -----------------------------------------------------
    <div className={className} style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Notifications</h2>
        <a href="#" style={styles.headerLink}>See all</a>
        {/* Optional: Add a close button for mobile/overlay view */}
      </div>
      <div style={styles.notificationList}>
        {notifications.map((notification, index) => (
          <div key={index} style={styles.notificationItem}>
            <div style={styles.notificationIcon}>
              <span>✉️</span>
            </div>
            <div style={styles.notificationContent}>
              {/* Note: The <p> tag has its own default margins, so we use the inline style on notificationTitle to reset it */}
              <p style={styles.notificationTitle}>{notification.title}</p>
              <span style={styles.notificationTime}>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSidebar;