// AppraisalSettings.jsx

import React from 'react';

const AppraisalTimerSection = ({ title, fields, addText }) => {
  return (
    <div className="appraisal-timer-section">
      
      {/* Button to trigger adding a new timer */}
      <div className="timer-add-header">
        <button className="add-timer-button">
          {addText || `ADD ${title.toUpperCase()} TIMER`}
          <span className="plus-icon">+</span>
        </button>
      </div>

      <div className="timer-settings-form">
        <h3 className="form-title">{title}</h3>
        
        {/* Render fields */}
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            <label>{field.label}:</label>
            <div className="input-with-note">
              <div className="input-row">
                {/* ******************************************************************
                  * KEY CHANGE: Set input type to "date" for native calendar support
                  ******************************************************************
                */}
                <input 
                  type="date" // Use "date" type for calendar functionality
                  className="timer-input-field"
                  // You might need a value/onChange handler here in a real application
                />
                
                {/* The native 'date' input often includes its own calendar icon. 
                  We keep the "Today |" text beside it for context.
                */}
                <span className="today-date-icon">Today | </span> 
                <span className="calendar-icon">📅</span> 
              </div>
              <p className="note">{field.note}</p>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn btn-save">SAVE</button>
          <button className="btn btn-save-add">Save and add another</button>
          <button className="btn btn-save-continue">Save and continue editing</button>
        </div>
      </div>
    </div>
  );
};

// Main component containing all three timer sections
const AppraisalSettings = () => {
  
  const employeeFields = [
    { label: 'Employee self appraisal start', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Employee self appraisal end', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Employee self appraisal remind', note: 'Note: You are 6 hours ahead of server time.' },
  ];
  
  const managerFields = [
    { label: 'Reporting manager review start', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Reporting manager review end', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Reporting manager review remind', note: 'Note: You are 6 hours ahead of server time.' },
  ];

  const finalFields = [
    { label: 'Final review start', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Final review end', note: 'Note: You are 6 hours ahead of server time.' },
    { label: 'Final review remind', note: 'Note: You are 6 hours ahead of server time.' },
  ];

  return (
    <div className="appraisal-settings-container">
      <h2>Appraisal Timer Settings</h2>
      
      <div className="appraisal-timers-list">
        
        <AppraisalTimerSection 
          title="Employee Appraisal Timer" 
          fields={employeeFields}
          addText="ADD EMPLOYEE APPRAISAL TIMER"
        />
        
        <AppraisalTimerSection 
          title="Reporting Manager Appraisal Timer" 
          fields={managerFields}
          addText="ADD MANAGER APPRAISAL TIMER"
        />

        <AppraisalTimerSection 
          title="Final Appraisal Timer" 
          fields={finalFields}
          addText="ADD FINAL APPRAISAL TIMER"
        />
        
      </div>
    </div>
  );
};

export default AppraisalSettings;
