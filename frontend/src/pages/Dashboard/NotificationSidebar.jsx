import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- API Configuration ---

// The base URL for the Django API (assumed to be relative to the application base)
const API_BASE_URL = '/api/notifications/'; 

// --- Helper Functions ---

/**
 * Executes fetch with exponential backoff for resilience.
 */
const fetchAuthorized = async (url, options = {}) => {
  const MAX_RETRIES = 3;
  let delay = 1000;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401 || response.status === 403) {
           throw new Error("Authentication Failed. Session expired or user unauthorized.");
      }

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorDetail.substring(0, 100)}`);
      }
      return response;
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

/**
 * Utility function to format the timestamp into relative time.
 */
const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

    // If older than a day, show full date
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Renders a simple, non-blocking message box styled similar to a notification item.
 */
const MessageBox = ({ message, style = {} }) => (
    <div className="notification-item" style={{ textAlign: 'center', padding: '15px', color: '#888', ...style }}>
        {message}
    </div>
);


// Accept className, onClose, and the new prop for communicating unread count
const NotificationSidebar = ({ className, onClose, onUnreadCountChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null); // This holds the API fetching error

    // Calculate unread count dynamically from the state
    const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);
    
    // Notify parent component about the unread count change
    useEffect(() => {
        if (onUnreadCountChange) {
            onUnreadCountChange(unreadCount);
        }
    }, [unreadCount, onUnreadCountChange]);


    // --- Data Fetching Logic (GET /api/notifications/) ---

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors before a new fetch
        try {
            // The backend is expected to return notifications sorted by newest first (-created_at)
            const response = await fetchAuthorized(API_BASE_URL);
            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            // Set error state only on API failure
            setError(err.message.includes("Authentication Failed") 
                ? "Session expired. Please log in again." 
                : "Could not load notifications.");
            setNotifications([]); // Ensure notifications array is empty on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);


    // --- Interaction Handlers ---

    // 1. Mark Single Notification as Read (POST /api/notifications/mark-read/<id>/)
    const markSingleAsRead = async (id, is_read_status) => {
        if (isSending || is_read_status) return; 
        
        setIsSending(true);
        setError(null);
        try {
            await fetchAuthorized(`${API_BASE_URL}mark-read/${id}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            // Optimistic UI update: Mark the item as read in the local state
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );

        } catch (err) {
            console.error(`Failed to mark notification ${id} as read:`, err);
            setError("Failed to update notification status.");
            fetchNotifications(); // Re-sync on failure
        } finally {
            setIsSending(false);
        }
    };

    // 2. Clear All Notifications (POST /api/notifications/delete-all/)
    const clearAllNotifications = async (e) => {
        e.preventDefault(); 
        if (isSending || notifications.length === 0) return;

        setIsSending(true);
        setError(null);
        try {
            // NOTE: Assuming a new endpoint for deleting all notifications
            await fetchAuthorized(`${API_BASE_URL}delete-all/`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
            });
            
            // Clear the local state after successful deletion
            setNotifications([]);

        } catch (err) {
            console.error("Failed to clear all notifications:", err);
            setError("Failed to delete all notifications.");
            fetchNotifications(); // Re-sync on failure
        } finally {
            setIsSending(false);
        }
    };

    // --- Content Rendering Logic ---
    const renderContent = () => {
        if (isLoading) {
            return <MessageBox message="Loading notifications..." />;
        }
        
        // ONLY show API error message if an error occurred during fetch
        if (error) {
            // The error variable contains the specific error message (e.g., "Could not load notifications.")
            return <MessageBox message={error} style={{ color: '#990000', backgroundColor: '#fee' }} />;
        }

        // Show "No notifications." if the list is empty and there's no error
        if (notifications.length === 0) {
            return <MessageBox message="No notifications." />;
        }
        
        // Render the actual notifications list
        return (
            <div className="notification-list">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        // Style container for unread status
                        style={{ 
                            // Apply a subtle unread background/border style
                            borderLeft: notification.is_read ? 'none' : '4px solid #3b82f6',
                            backgroundColor: notification.is_read ? '#fff' : '#f0f8ff',
                            cursor: notification.is_read ? 'default' : 'pointer'
                        }}
                        className="notification-item"
                        // Mark as read on click
                        onClick={() => markSingleAsRead(notification.id, notification.is_read)}
                    >
                        <div className="notification-icon">
                            {/* Change icon based on read status */}
                            <span>{notification.is_read ? '✉️' : '🔔'}</span>
                        </div>
                        <div className="notification-content">
                            {/* Use font-weight: bold for unread notifications */}
                            <p 
                                className="notification-title"
                                style={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}
                            >
                                {notification.title}
                            </p>
                            <span 
                                className="notification-time"
                                style={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}
                            >
                                {formatTime(notification.created_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`${className} notification-sidebar`}>
            
            {/* Notification Header */}
            <div className="notification-header">
                <h2 className="header-title">Notifications</h2>
                
                {/* Repurposed "See all" to "Clear All" action */}
                <a 
                    href="#" 
                    onClick={clearAllNotifications} 
                    className={`header-link ${notifications.length === 0 || isSending || error ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
                >
                    {isSending ? 'Clearing...' : 'Clear All'}
                </a>
            </div>

            {/* Render Content based on state */}
            {renderContent()}
            
        </div>
    );
};

export default NotificationSidebar;
