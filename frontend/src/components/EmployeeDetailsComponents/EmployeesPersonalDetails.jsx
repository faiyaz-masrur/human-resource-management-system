// src/components/EmployeeDetailsComponents/EmployeesPersonalDetails.jsx
import React, { useState } from 'react';

const EmployeesPersonalDetails = ({ onNext, onBack }) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  return (
    <div className="personal-details">
      <div className="details-card">
        {/* First Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Employee Name*</label>
            <div className="form-value">Liton Kumar Das</div>
          </div>
          <div className="form-group">
            <label>Father's Name*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Father's Name"
            />
          </div>
          <div className="form-group">
            <label>Mother's Name*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Mother's Name"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number*</label>
            <input 
              type="tel" 
              className="form-input"
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="form-group">
            <label>Email ID*</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="Enter email ID"
            />
          </div>
          <div className="form-group">
            <label>National ID*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter National ID"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth*</label>
            <input 
              type="date" 
              className="date-input"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Passport Number</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Passport Number"
            />
          </div>
          <div className="form-group">
            <label>Blood Group*</label>
            <select className="form-select">
              <option value="">-- Select --</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Marital Status*</label>
            <select className="form-select">
              <option value="">-- Select --</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Spouse Name*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Spouse Name"
            />
          </div>
          <div className="form-group">
            <label>Spouse NID*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Spouse NID"
            />
          </div>
        </div>

        {/* Fifth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Emergency Contact Name*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter Emergency Contact Name"
            />
          </div>
          <div className="form-group">
            <label>Relationship*</label>
            <select className="form-select">
              <option value="">-- Select --</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Emergency Contact Number*</label>
            <input 
              type="tel" 
              className="form-input"
              placeholder="Enter Emergency Phone Number"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPersonalDetails;