import React, { useState, useEffect } from "react";
import api from "../../services/api";
import ReconcileRequest from "./ReconcileRequest"; // <-- IMPORT
import "../../styles/attendance/MyAttendanceHistory.css";

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


const MyAttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  // --- State for Modal ---
  const [showReconcile, setShowReconcile] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("employee_id");
    if (storedId) setEmployeeId(storedId);
  }, []);

  const fetchHistory = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const response = await api.get(
        `/attendance/history/${employeeId}/?month=${month}&year=${year}`
      );
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [employeeId, month, year]);

  // --- Handlers for Modal ---
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setShowReconcile(true);
  };

  const handleReconcileClose = () => {
    setShowReconcile(false);
    setSelectedRecord(null);
  };

  const handleReconcileSuccess = () => {
    setShowReconcile(false);
    setSelectedRecord(null);
    fetchHistory(); // Refresh the data
  };

  return (
    <div className="attendance-history">
      <h2>Attendance History</h2>

      <div className="filters">
        {/* ... (filters remain the same) ... */}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Total Work</th>
              <th>Remarks</th>
              <th>Actions</th> {/* <-- NEW COLUMN */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" style={{textAlign: "center"}}>Loading...</td></tr>
            ) : records.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: "center"}}>No records found.</td></tr>
            ) : (
                records.map((r) => (
                <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{formatTime(r.in_time)}</td>
                    <td>{formatTime(r.out_time)}</td>
                    <td>{r.total_work_hours || "00:00"}</td>
                    <td>{r.remarks || ""}</td>
                    <td>
                        {/* --- NEW EDIT BUTTON --- */}
                        <button 
                            className="btn-edit" 
                            onClick={() => handleEditClick(r)}
                            title="Request Reconciliation"
                        >
                            🖊️
                        </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- CONDITIONAL MODAL --- */}
      {showReconcile && selectedRecord && (
        <ReconcileRequest
          attendanceId={selectedRecord.id}
          initialOutTime={selectedRecord.out_time}
          initialRemarks={selectedRecord.remarks}
          onClose={handleReconcileClose}
          onSuccess={handleReconcileSuccess}
        />
      )}
    </div>
  );
};

export default MyAttendanceHistory;