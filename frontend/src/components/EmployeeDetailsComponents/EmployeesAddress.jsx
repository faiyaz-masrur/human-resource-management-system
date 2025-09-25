// src/components/EmployeeDetailsComponents/EmployeesAddress.jsx
import React from 'react';

const EmployeesAddress = ({ onNext, onBack }) => {
  return (
    <div className="address-details">
      <div className="details-card">
        <h3 className="section-title">Present Address</h3>
        
        {/* Row 1: House, Apartment & Police Station */}
        <div className="form-row">
          <div className="form-group">
            <label>House, Apartment*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter details"
            />
          </div>
          <div className="form-group">
            <label>Police Station</label>
            <select className="form-select">
              <option value="pallabi">Pallabi</option>
              <option value="mirpur">Mirpur</option>
              <option value="gulshan">Gulshan</option>
            </select>
          </div>
        </div>

        {/* Row 2: Road/Block/Sector & City/Village */}
        <div className="form-row">
          <div className="form-group">
            <label>Road/Block/Sector</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="2"
            />
          </div>
          <div className="form-group">
            <label>City/Village</label>
            <div className="form-value">Pallabi</div>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>District</label>
            <select className="form-select">
              <option value="dhaka">Dhaka</option>
              <option value="chittagong">Chittagong</option>
              <option value="sylhet">Sylhet</option>
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <div className="form-value">1216</div>
          </div>
        </div>

        <h3 className="section-title">Permanent Address</h3>
        
        {/* Row 1: House, Apartment & Police Station */}
        <div className="form-row">
          <div className="form-group">
            <label>House, Apartment*</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter details"
            />
          </div>
          <div className="form-group">
            <label>Police Station</label>
            <select className="form-select">
              <option value="pallabi">Pallabi</option>
              <option value="mirpur">Mirpur</option>
              <option value="gulshan">Gulshan</option>
            </select>
          </div>
        </div>

        {/* Row 2: Road/Block/Sector & City/Village */}
        <div className="form-row">
          <div className="form-group">
            <label>Road/Block/Sector</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="2"
            />
          </div>
          <div className="form-group">
            <label>City/Village</label>
            <div className="form-value">Pallabi</div>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>District</label>
            <select className="form-select">
              <option value="dhaka">Dhaka</option>
              <option value="chittagong">Chittagong</option>
              <option value="sylhet">Sylhet</option>
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <div className="form-value">1216</div>
          </div>
        </div>
        
        <div className="form-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesAddress;