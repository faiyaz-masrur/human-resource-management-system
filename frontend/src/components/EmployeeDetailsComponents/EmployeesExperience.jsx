// src/components/EmployeeDetailsComponents/EmployeesExperience.jsx
import React, { useState } from 'react';

const EmployeesExperience = ({ onNext, onBack }) => {
  const [currentStartDate, setCurrentStartDate] = useState('2023-06-11');
  const [previousExperiences, setPreviousExperiences] = useState([
    {
      id: 1,
      organization: '',
      designation: '',
      department: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    }
  ]);

  const addNewExperience = () => {
    setPreviousExperiences([
      ...previousExperiences,
      {
        id: previousExperiences.length + 1,
        organization: '',
        designation: '',
        department: '',
        startDate: '',
        endDate: '',
        responsibilities: ''
      }
    ]);
  };

  const removeExperience = (id) => {
    if (previousExperiences.length > 1) {
      setPreviousExperiences(previousExperiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id, field, value) => {
    setPreviousExperiences(previousExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <div className="experience-details">
      <div className="details-card">
        {/* Current Experience Section */}
        <h3 className="section-title">Current Experience</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Organization Name*</label>
            <div className="form-value">Sonali Intellect Limited</div>
          </div>
          <div className="form-group">
            <label>Designation*</label>
            <div className="form-value">Senior Manager</div>
          </div>
          <div className="form-group">
            <label>Department/Division*</label>
            <div className="form-value">Human Resource</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date*</label>
            <input 
              type="date" 
              className="date-input"
              value={currentStartDate}
              onChange={(e) => setCurrentStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date*</label>
            <div className="form-value present-text">Present</div>
          </div>
          <div className="form-group">
            {/* Empty for spacing */}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Job Responsibilities</label>
            <textarea 
              className="form-textarea"
              placeholder="Write the job context here"
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Previous Experiences Section */}
        {previousExperiences.map((experience, index) => (
          <div key={experience.id} className="previous-experience-section">
            <h3 className="section-title">Previous Experience {experience.id}</h3>
            
            {/* Organization, Designation Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Organization Name*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Organization Name"
                  value={experience.organization}
                  onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Designation*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Designation"
                  value={experience.designation}
                  onChange={(e) => updateExperience(experience.id, 'designation', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Department/Division*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Department Name"
                  value={experience.department}
                  onChange={(e) => updateExperience(experience.id, 'department', e.target.value)}
                />
              </div>
            </div>

            {/* Start Date, End Date Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Start Date*</label>
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date*</label>
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                {previousExperiences.length > 1 && (
                  <button 
                    className="btn-remove-experience"
                    onClick={() => removeExperience(experience.id)}
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Job Responsibilities */}
            <div className="form-row">
              <div className="form-group full-width">
                <label>Job Responsibilities</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Write the job context here"
                  rows="4"
                  value={experience.responsibilities}
                  onChange={(e) => updateExperience(experience.id, 'responsibilities', e.target.value)}
                ></textarea>
              </div>
            </div>

            {index < previousExperiences.length - 1 && <hr className="section-divider" />}
          </div>
        ))}

        {/* Add New Experience Button */}
        <div className="form-row">
          <div className="form-group">
            <button type="button" className="btn-add-experience" onClick={addNewExperience}>
              + Add New Experience
            </button>
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

export default EmployeesExperience;