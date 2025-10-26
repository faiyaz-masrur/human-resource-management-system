import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/attendance/ReconcileRequest.css";

// This component is now designed to be rendered inside a modal/overlay
const ReconcileRequest = ({ 
  attendanceId, 
  initialOutTime, 
  initialRemarks, 
  onClose, 
  onSuccess 
}) => {
  // Initialize state from props
  const [newOutTime, setNewOutTime] = useState("");
  const [remarks, setRemarks] = useState(initialRemarks || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Format the initialOutTime to be compatible with datetime-local input
    if (initialOutTime) {
      try {
        // datetime-local input requires 'YYYY-MM-DDTHH:mm'
        const d = new Date(initialOutTime);
        const formatted = d.toISOString().slice(0, 16);
        setNewOutTime(formatted);
      } catch (e) {
        setNewOutTime("");
      }
    } else {
        // If no out time, try to set a default (e.g., today 5:30 PM)
        // This logic can be adjusted.
        const d = new Date();
        d.setHours(17, 30);
        setNewOutTime(d.toISOString().slice(0, 16));
    }
    setRemarks(initialRemarks || "");
  }, [attendanceId, initialOutTime, initialRemarks]);


  const submitRequest = async () => {
    if (!newOutTime) {
        setMessage("Please select a valid new out-time.");
        return;
    }
    if (!remarks) {
        setMessage("Remarks are required for reconciliation.");
        return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/attendance/reconcile/", {
        attendance_id: attendanceId,
        new_out_time: newOutTime, // Send in ISO format
        remarks,
      });
      setMessage("Reconciliation submitted successfully!");
      
      // Call the success callback passed from the parent
      if (onSuccess) {
        setTimeout(() => {
            onSuccess();
        }, 1500); // Give user time to read success message
      }

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Failed to submit reconciliation.");
    } finally {
        setLoading(false);
    }
  };

  return (
    // This 'modal-overlay' div should be styled in AttendanceHistory.css
    <div className="reconcile-modal-overlay"> 
      <div className="reconcile-container">
        <h2>Reconcile Attendance</h2>
        
        <p className="reconcile-info">
            Updating record ID: <strong>{attendanceId}</strong>
        </p>

        <label>New Out-Time:</label>
        <input
          type="datetime-local"
          value={newOutTime}
          onChange={(e) => setNewOutTime(e.target.value)}
          disabled={loading}
        />

        <label>Remarks (Required):</label>
        <textarea
          placeholder="Reason for change..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          disabled={loading}
        />

        <div className="reconcile-actions">
            <button onClick={onClose} disabled={loading} className="btn-cancel">
                Cancel
            </button>
            <button onClick={submitRequest} disabled={loading} className="btn-submit">
                {loading ? "Submitting..." : "Submit Request"}
            </button>
        </div>

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
};

export default ReconcileRequest;
