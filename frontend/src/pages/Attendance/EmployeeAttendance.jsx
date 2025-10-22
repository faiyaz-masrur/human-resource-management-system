import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/attendance/EmployeeAttendance.css";

// Helper to format time
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "—";
  try {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const EmployeeAttendance = () => {
  const { employeeId } = useParams();
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Fetch employee attendance history dynamically
  const fetchHistory = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const response = await api.get(
        `/attendance/history/${employeeId}/?month=${month}&year=${year}`
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching employee attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [employeeId, month, year]);

  return (
    <div className="employee-attendance-container">
      <h2>Employee Attendance History</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="number"
          value={year}
          min="2000"
          max="2100"
          onChange={e => setYear(parseInt(e.target.value))}
        />
        <input
          type="number"
          value={month}
          min="1"
          max="12"
          onChange={e => setMonth(parseInt(e.target.value))}
        />
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Total Work</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No records found.</td>
              </tr>
            ) : (
              records.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{formatTime(r.in_time)}</td>
                  <td>{formatTime(r.out_time)}</td>
                  <td>{r.total_work_hours || "00:00"}</td>
                  <td>{r.remarks || ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
