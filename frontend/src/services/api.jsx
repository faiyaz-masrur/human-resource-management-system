import axios from 'axios';

// --- BASE URLS ---
// Note: Your setup had two different base URLs. I'm clarifying them.
const API_BASE_URL = "http://127.0.0.1:8000/api"; // For auth, history, etc.
const ATTENDANCE_BASE_URL = "http://127.0.0.1:8000/attendance"; // For attendance-specific events

// --- Standalone fetch functions for attendance events ---
// These use 'fetch' as in your original file, but could be converted to use the 'api' instance.

// Fetch Google Maps API key
export const fetchApiKey = async () => {
  // Using the /attendance/api-key/ path
  const response = await fetch(`${ATTENDANCE_BASE_URL}/api-key/`);
  const data = await response.json();
  return data.key;
};

// Log enter/exit event
export const logEvent = async (employeeId, geofenceId, eventType, isFinalExit) => {
  const payload = {
    employee: employeeId,
    geofence_id: geofenceId,
    event_type: eventType, // 'enter' or 'exit'
    is_final_exit: isFinalExit, // Pass this boolean
  };

  const response = await fetch(`${ATTENDANCE_BASE_URL}/events/log_event/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to log event');
  }
  return await response.json(); // This will now return the full attendance object
};


// --------------------------------------------------
// Axios instance for other API calls (history, reconcile, auth)
// --------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL, // Use the /api base
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (interceptors remain exactly the same) ...

// --- NEW FUNCTION ---
// Add this function to your file
export const fetchTodayAttendance = async (employeeId) => {
  // This uses the /attendance/today/ endpoint, which is outside the /api prefix
  // We'll use the 'api' instance but override the URL
  try {
    const response = await api.get(`/attendance/today/?employee_id=${employeeId}`, {
       baseURL: 'http://127.0.0.1:8000' // Override base URL
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return null;
  }
};


export default api;