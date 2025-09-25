// src/components/EmployeeDetailsComponents/EmployeesOfficialDetails.jsx
import React, { useState } from 'react';

const EmployeesOfficialDetails = ({ onNext, onBack }) => {
  const [joiningDate, setJoiningDate] = useState('2025-03-24');
  return (
    <div className="official-details">
      <div className="details-card">
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID*</label>
            <div className="form-value">1061</div>
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
            <select className="form-select">
              <option value="senior-manager">Senior Manager</option>
              <option value="manager">Manager</option>
              <option value="assistant-manager">Assistant Manager</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department*</label>
            <select className="form-select">
              <option value="hr">Human Resource</option>
              <option value="it">IT</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div className="form-group">
            <label>Joining Date*</label>
            <input 
              type="date" 
              className="date-input"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Grade*</label>
            <select className="form-select">
              <option value="t-xxx">T-XXX</option>
              <option value="t-yyy">T-YYY</option>
              <option value="t-zzz">T-ZZZ</option>
            </select>
          </div>
          <div className="form-group">
            <label>Reporting Manager*</label>
            <select className="form-select">
              <option value="jahangir">S M Jahangir Akhter</option>
              <option value="manager2">Other Manager 1</option>
              <option value="manager3">Other Manager 2</option>
            </select>
          </div>
          <div className="form-group">
            <label>Basic Salary*</label>
            <div className="form-value">XXXXXXXXX</div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Role 1*</label>
            <select className="form-select">
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="form-group">
            <label>Role 2*</label>
            <select className="form-select">
              <option value="">-- Select --</option>
              <option value="backup-manager">Backup Manager</option>
              <option value="team-lead">Team Lead</option>
            </select>
          </div>
          <div className="form-group">
            <label>Is HR*</label>
            <select className="form-select">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

{/* ===== Review by part ===== */}
<div style={{ gridColumn: '1 / -1', fontFamily: 'sans-serif' }}>
  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '13px' }}>
    Review By
  </label>
  <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '24px',
      padding: '10px',
      
      border: '1px solid #ddd',
      borderRadius: '4px'
  }}>

    {/* Checkbox Item 1 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" id="reviewBy-rm" style={{ margin: 0 }} />
      <label htmlFor="reviewBy-rm" style={{ margin: 0 }}>RM</label>
    </div>

    {/* Checkbox Item 2 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" id="reviewBy-hr" style={{ margin: 0 }} />
      <label htmlFor="reviewBy-hr" style={{ margin: 0 }}>HR</label>
    </div>

    {/* Checkbox Item 3 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" id="reviewBy-hod" style={{ margin: 0 }} />
      <label htmlFor="reviewBy-hod" style={{ margin: 0 }}>HOD</label>
    </div>

    {/* Checkbox Item 4 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" id="reviewBy-coo" style={{ margin: 0 }} />
      <label htmlFor="reviewBy-coo" style={{ margin: 0 }}>COO</label>
    </div>

    {/* Checkbox Item 5 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" id="reviewBy-ceo" style={{ margin: 0 }} />
      <label htmlFor="reviewBy-ceo" style={{ margin: 0 }}>CEO</label>
    </div>

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

export default EmployeesOfficialDetails;