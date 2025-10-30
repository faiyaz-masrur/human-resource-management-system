import React, { useState, useEffect } from "react";
import GeoFenceMap from "./GeoFenceMap"; 
import "../../styles/attendance/MyAttendance.css";

// Helper to format time
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "—";
  try {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const MyAttendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get employee ID from local storage
  useEffect(() => {
    const storedId = localStorage.getItem("employee_id");
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      setError("Employee ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Fetch today's record once employee ID is set
  useEffect(() => {
    if (employeeId) {
      setLoading(true);
      fetchTodayAttendance(employeeId)
        .then(data => {
          setTodayRecord(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch today's attendance.");
          setLoading(false);
        });
    }
  }, [employeeId]);

  // This callback is passed to GeoFenceMap
  const handleEventLogged = (updatedRecord) => {
    // The backend log_event view now returns the updated record.
    // We just set it in our state to re-render the status.
    setTodayRecord(updatedRecord);
  };

  const renderStatusCard = () => {
    if (loading) return <p>Loading today's records...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!todayRecord) return <p>No attendance data for today.</p>;

    return (
      <div className="status-card">
        <h3>Today's Records ({todayRecord.date})</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">In Time</span>
            <span className="value in-time">{formatTime(todayRecord.in_time)}</span>
            <span className="sub-label">{todayRecord.in_time_label}</span>
          </div>
          <div className="status-item">
            <span className="label">Out Time</span>
            <span className="value out-time">{formatTime(todayRecord.out_time)}</span>
             <span className="sub-label">{todayRecord.out_time_label}</span>
          </div>
          <div className="status-item">
            <span className="label">Total Work</span>
            <span className="value">{todayRecord.total_work_hours || "00:00"}</span>
            <span className="sub-label">hours</span>
          </div>
          <div className="status-item">
            <span className="label">Outside Office</span>
            <span className="value">{todayRecord.outside_hours || "00:00"}</span>
             <span className="sub-label">hours</span>
          </div>
        </div>
        {todayRecord.remarks && (
            <div className="status-remarks">
                <strong>Remarks:</strong> {todayRecord.remarks}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="attendance-container">
      <h2>Today's Attendance</h2>
      
      {/* Display Today's Records */}
      {renderStatusCard()}

      {/* Display Geofence Map and Controls */}
      <div className="map-section">
        <h3>Geofence Status</h3>
        <p>Simulate entering/exiting the office geofence.</p>
        {employeeId ? (
          <GeoFenceMap 
            employeeId={employeeId} 
            onEventLogged={handleEventLogged} 
          />
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;