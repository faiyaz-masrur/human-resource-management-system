// src/components/EmployeeDetailsComponents/EmployeesEducation.jsx
import React, { useState } from 'react';

const EmployeesEducation = ({ onNext, onBack }) => {
  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: '',
      institution: '',
      passingYear: '',
      specialization: '',
      result: '',
      certificate: null
    }
  ]);

  const addNewEducation = () => {
    setEducations([
      ...educations,
      {
        id: educations.length + 1,
        degree: '',
        institution: '',
        passingYear: '',
        specialization: '',
        result: '',
        certificate: null
      }
    ]);
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id, field, value) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      updateEducation(id, 'certificate', file);
    }
  };

  return (
    <div className="education-details">
      <div className="details-card">
        {educations.map((education, index) => (
          <div key={education.id} className="education-section">
            <h3 className="section-title">Education {education.id}</h3>
            
            {/* First Row: Degree, Institution, Passing Year */}
            <div className="form-row">
              <div className="form-group">
                <label>Degree*</label>
                <select 
                  className="form-select"
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="ssc">SSC</option>
                  <option value="hsc">HSC</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="masters">Masters</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Institution*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Institution Name"
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Passing Year*</label>
                <select 
                  className="form-select"
                  value={education.passingYear}
                  onChange={(e) => updateEducation(education.id, 'passingYear', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {Array.from({length: 30}, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Second Row: Specialization, Result, Certificate */}
            <div className="form-row">
              <div className="form-group">
                <label>Specialization*</label>
                <select 
                  className="form-select"
                  value={education.specialization}
                  onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="business">Business Administration</option>
                  <option value="engineering">Engineering</option>
                  <option value="arts">Arts</option>
                  <option value="science">Science</option>
                </select>
              </div>
              <div className="form-group">
                <label>Result/Grade*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Division or CGPA or Grade"
                  value={education.result}
                  onChange={(e) => updateEducation(education.id, 'result', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Attach Certificate</label>
                <div className="file-upload-container">
                  <input 
                    type="file" 
                    className="file-input"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileChange(education.id, e)}
                  />
                  <div className="file-display">
                    {education.certificate ? (
                      <span className="file-name">{education.certificate.name}</span>
                    ) : (
                      <span className="file-placeholder">Attach File (.pdf / .jpg / .png)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Remove button for additional educations */}
            {educations.length > 1 && (
              <div className="form-row">
                <div className="form-group">
                  <button 
                    type="button"
                    className="btn-remove-education"
                    onClick={() => removeEducation(education.id)}
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            )}

            {/* Divider between education sections */}
            {index < educations.length - 1 && <hr className="section-divider" />}
          </div>
        ))}

        {/* Add New Education Button */}
        <div className="form-row">
          <div className="form-group">
            <button type="button" className="btn-add-education" onClick={addNewEducation}>
              + Add New Education
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

export default EmployeesEducation;