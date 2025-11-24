import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const NotificationSidebar = ({ className, unreadCount, updateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [unreadCount]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('notifications/');
      console.log("Notification list:", res.data)
      setNotifications(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([])
    }
  };

 
  const markAllAsRead = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      await api.post('notifications/mark-all-read/');
      fetchNotifications(); // refresh list after marking all as read
      updateUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className={`${className} notification-sidebar`}>
      <div className="notification-header">
        <h2 className="header-title">Notifications</h2>
   
        <a href="#" className="header-link" onClick={markAllAsRead}>
          Mark all read
        </a>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <div className="notification-icon">
                <span>✉️</span>
              </div>
              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-title">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationSidebar;
