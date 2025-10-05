import React, { useState } from 'react';
import EmployeeAppraisal from '../../components/AppraisalDetailsComponents/EmployeeAppraisal';


const MyAppraisal = () => {

  return (
    
    <div className="appraisal-page-container">
      {/* Employee Details Section */}
      <div className="employee-details-card">
        <h2 className="employee-details-title">Employee Details</h2>
        <div className="employee-details-grid">
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee ID</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee Name</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Appraisal Period</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Designation</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Department</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Joining Date</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Grade</label>
            <div className="employee-detail-value"></div>
          </div>
        </div>
      </div>
        {/* Render active appraisal content */}
        <EmployeeAppraisal />
    </div>
  );
};

export default MyAppraisal;
