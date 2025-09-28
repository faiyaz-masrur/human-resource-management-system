import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const EmployeesOfficialDetails = ({ onNext, onBack }) => {
  const { user } = useAuth();
  const defaultDetails = {
    employee_id: "",
    email: "",
    employee_name: "",
    designation: "",
    department: "",
    joining_date: "",
    grade_id: "",
    reporting_manager_id: "",
    basic_salary: "",
    role1: "",
    role2: "",
    is_hr: false,
    reviewed_by_rm: false,
    reviewed_by_hr: false,
    reviewed_by_hod: false,
    reviewed_by_coo: false,
    reviewed_by_ceo: false,
  };

  const [details, setDetails] = useState(defaultDetails);

  // ✅ Fetch employee details if ID exists
  useEffect(() => {
    const fetchDetails = async () => {
      if (!user) return; 
      try {
        const res = await api.get(
          `employees/empolyee-official-details/${user.id}/`
        );
        console.log(res.data)
        setDetails(res.data || defaultDetails); 
      } catch (error) {
        console.warn("No employee details found, showing empty form.");
        setDetails(defaultDetails);
      }
    };

    fetchDetails();
  }, [user]);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Save (create if new, update if existing)
  const handleSave = async () => {
    try {
      if (user) {
        // Update existing employee
        await api.patch(
          `employees/empolyee-official-details/${user.id}/`,
          details
        );
        alert("Employee details updated successfully!");
      } else {
        // Create new employee
        const res = await api.post(
          `/employees/empolyee-official-details/`,
          details
        );
        alert("Employee created successfully!");
        console.log("New Employee:", res.data);
      }
    } catch (error) {
      console.error("Error saving employee:", error.response?.data || error);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="official-details">
      <div className="details-card">
        {/* First Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID*</label>
            <input
              type="text"
              className="form-input"
              value={details.employee_id}
              onChange={(e) => handleChange("employee_id", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              className="form-input"
              value={details.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Employee Name*</label>
            <input
              type="text"
              className="form-input"
              value={details.employee_name}
              onChange={(e) => handleChange("employee_name", e.target.value)}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Designation*</label>
            <select
              className="form-select"
              value={details.designation_id}
              onChange={(e) => handleChange("designation_id", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="1">Senior Manager</option>
              <option value="2">Manager</option>
              <option value="3">Assistant Manager</option>
              <option value="4">Executive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department*</label>
            <select
              className="form-select"
              value={details.department_id}
              onChange={(e) => handleChange("department_id", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="1">Human Resource</option>
              <option value="2">IT</option>
              <option value="3">Finance</option>
              <option value="4">Marketing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Joining Date*</label>
            <input
              type="date"
              className="date-input"
              value={details.joining_date || ""}
              onChange={(e) => handleChange("joining_date", e.target.value)}
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Grade*</label>
            <select
              className="form-select"
              value={details.grade_id}
              onChange={(e) => handleChange("grade_id", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="1">T-XXX</option>
              <option value="2">T-YYY</option>
              <option value="3">T-ZZZ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reporting Manager*</label>
            <select
              className="form-select"
              value={details.reporting_manager_id}
              onChange={(e) =>
                handleChange("reporting_manager_id", e.target.value)
              }
            >
              <option value="">-- Select --</option>
              <option value="1">S M Jahangir Akhter</option>
              <option value="2">Other Manager 1</option>
              <option value="3">Other Manager 2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Basic Salary*</label>
            <input
              type="number"
              className="form-input"
              value={details.basic_salary}
              onChange={(e) => handleChange("basic_salary", e.target.value)}
            />
          </div>
        </div>

        {/* Review Checkboxes */}
        <div style={{ gridColumn: "1 / -1", fontFamily: "sans-serif" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            Review By
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {["rm", "hr", "hod", "coo", "ceo"].map((role) => (
              <div
                key={role}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={details[`reviewed_by_${role}`] || false}
                  onChange={(e) =>
                    handleChange(`reviewed_by_${role}`, e.target.checked)
                  }
                />
                <label>{role.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn-primary" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesOfficialDetails;
