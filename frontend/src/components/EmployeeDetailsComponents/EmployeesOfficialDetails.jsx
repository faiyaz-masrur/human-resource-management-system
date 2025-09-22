// src/components/EmployeeDetailsComponents/EmployeesOfficialDetails.jsx
import React from 'react';

const EmployeesOfficialDetails = () => {
  return (
    <div className="official-details">
      <div className="details-card">
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID*</label>
            <div className="form-value">1081</div>
          </div>
          <div className="form-group">
            <label>Employee Username*</label>
            <div className="form-value">liton.das</div>
          </div>
          <div className="form-group">
            <label>Employee Name*</label>
            <div className="form-value">Liton Kumar Das</div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Designation*</label>
            <div className="form-value">Senior Manager</div>
          </div>
          <div className="form-group">
            <label>Department*</label>
            <div className="form-value">Human Resource</div>
          </div>
          <div className="form-group">
            <label>Joining Date*</label>
            <div className="form-value">24 Mar 2025</div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Grade*</label>
            <div className="form-value">T-XXX</div>
          </div>
          <div className="form-group">
            <label>Reporting Manager*</label>
            <div className="form-value">S M Jahangir Akhter</div>
          </div>
          <div className="form-group">
            <label>Basic Salary*</label>
            <div className="form-value">XXXXXXXXXX</div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Role 1*</label>
            <div className="form-value">Manager</div>
          </div>
          <div className="form-group">
            <label>Role 2*</label>
            <div className="form-value">-- Select --</div>
          </div>
          <div className="form-group">
            <label>Is HR*</label>
            <div className="form-value">Yes</div>
          </div>
        </div>
        
        <div className="form-actions">
          <button className="btn-secondary">Back</button>
          <button className="btn-primary">Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesOfficialDetails;