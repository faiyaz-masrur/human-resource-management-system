// src/components/EmployeeDetailsComponents/EmployeesTrainingCertifications.jsx
import React, { useState } from 'react';

const EmployeesTrainingCertifications = ({ onNext, onBack }) => {
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: '',
      institution: '',
      year: '',
      type: '',
      credentialId: '',
      certificate: null
    }
  ]);

  const addNewTraining = () => {
    setTrainings([
      ...trainings,
      {
        id: trainings.length + 1,
        title: '',
        institution: '',
        year: '',
        type: '',
        credentialId: '',
        certificate: null
      }
    ]);
  };

  const removeTraining = (id) => {
    if (trainings.length > 1) {
      setTrainings(trainings.filter(training => training.id !== id));
    }
  };

  const updateTraining = (id, field, value) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, [field]: value } : training
    ));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      updateTraining(id, 'certificate', file);
    }
  };

  return (
    <div className="training-details">
      <div className="details-card">
        {trainings.map((training, index) => (
          <div key={training.id} className="training-section">
            <h3 className="section-title">Training/Certifications {training.id}</h3>
            
            {/* First Row: Title, Institution, Year */}
            <div className="form-row">
              <div className="form-group">
                <label>Title*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Training or Certification Name"
                  value={training.title}
                  onChange={(e) => updateTraining(training.id, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Institution*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Institution Name"
                  value={training.institution}
                  onChange={(e) => updateTraining(training.id, 'institution', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Year*</label>
                <select 
                  className="form-select"
                  value={training.year}
                  onChange={(e) => updateTraining(training.id, 'year', e.target.value)}
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

            {/* Second Row: Type, Credential ID, Certificate */}
            <div className="form-row">
              <div className="form-group">
                <label>Type*</label>
                <select 
                  className="form-select"
                  value={training.type}
                  onChange={(e) => updateTraining(training.id, 'type', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="training">Training</option>
                  <option value="certification">Certification</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="course">Course</option>
                </select>
              </div>
              <div className="form-group">
                <label>Credential ID or Reference ID</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter ID/Reference/Tracking Number"
                  value={training.credentialId}
                  onChange={(e) => updateTraining(training.id, 'credentialId', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Attach Certificate</label>
                <div className="file-upload-container">
                  <input 
                    type="file" 
                    className="file-input"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileChange(training.id, e)}
                  />
                  <div className="file-display">
                    {training.certificate ? (
                      <span className="file-name">{training.certificate.name}</span>
                    ) : (
                      <span className="file-placeholder">Attach File (.pdf / .jpg / .png)</span>
                    )}
                  </div>
              
                </div>
              </div>
            </div>

            {/* Remove button for additional trainings */}
            {trainings.length > 1 && (
              <div className="form-row">
                <div className="form-group">
                  <button 
                    type="button"
                    className="btn-remove-training"
                    onClick={() => removeTraining(training.id)}
                  >
                    Remove Training/Certification
                  </button>
                </div>
              </div>
            )}

            {/* Divider between training sections */}
            {index < trainings.length - 1 && <hr className="section-divider" />}
          </div>
        ))}

        {/* Add New Training Button */}
        <div className="form-row">
          <div className="form-group">
            <button type="button" className="btn-add-training" onClick={addNewTraining}>
              + Add New Training/Certification
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

export default EmployeesTrainingCertifications;