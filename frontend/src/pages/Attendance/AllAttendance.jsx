import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/attendance/AllAttendance.css";

const AllAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default today
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all employees' attendance for selected date
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/all/?date=${date}`);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when date changes
  useEffect(() => {
    fetchAttendance();
  }, [date]);

  // Filter by employee name or ID
  const filteredRecords = records.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.employee_id.toString().includes(search)
  );

  return (
    <div className="all-attendance-container">
      <h2>All Employees Attendance</h2>

      {/* Top Controls */}
      <div className="filters">
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input 
          type="text"
          placeholder="Search by ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn-generate"
          onClick={() => navigate("/attendance/report", { state: { date } })}
        >
          Generate Report
        </button>
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Total Work</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No records found.</td>
              </tr>
            ) : (
              filteredRecords.map(r => (
                <tr key={r.employee_id}>
                  <td>
                    <span
                      className="clickable"
                      onClick={() => navigate(`/attendance/employee/${r.employee_id}`)}
                    >
                      {r.employee_id}
                    </span>
                  </td>
                  <td>
                    <span
                      className="clickable"
                      onClick={() => navigate(`/attendance/employee/${r.employee_id}`)}
                    >
                      {r.name}
                    </span>
                  </td>
                  <td>{r.in_time || "—"}</td>
                  <td>{r.out_time || "—"}</td>
                  <td>{r.total_work_hours || "00:00"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAttendance;
