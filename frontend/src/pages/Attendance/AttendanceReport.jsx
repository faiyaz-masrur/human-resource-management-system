import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../styles/attendance/AttendanceReport.css";

const AttendanceReport = () => {
  const { state } = useLocation(); // expects { date }
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch report dynamically
  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/report/?date=${state.date}`);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.date) fetchReport();
  }, [state?.date]);

  // PDF download
  const handleDownload = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${state.date}`, 14, 20);

    const tableBody = reportData.summary.map(r => [
      r.name,
      r.total_work_hours,
      r.present_days,
      r.absent_days,
      JSON.stringify(r.label_counts)
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Employee", "Total Hours", "Present Days", "Absent Days", "Other Labels"]],
      body: tableBody,
    });

    doc.save(`Attendance_Report_${state.date}.pdf`);
  };

  if (loading) return <p>Loading report...</p>;
  if (!reportData) return <p>No report data available.</p>;

  return (
    <div className="attendance-report-container">
      <h2>Attendance Report - {state.date}</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Total Hours</th>
              <th>Present Days</th>
              <th>Absent Days</th>
              <th>Other Labels</th>
            </tr>
          </thead>
          <tbody>
            {reportData.summary.map(r => (
              <tr key={r.employee_id}>
                <td>{r.name}</td>
                <td>{r.total_work_hours}</td>
                <td>{r.present_days}</td>
                <td>{r.absent_days}</td>
                <td>{JSON.stringify(r.label_counts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-download" onClick={handleDownload}>
        Download PDF
      </button>
    </div>
  );
};

export default AttendanceReport;
