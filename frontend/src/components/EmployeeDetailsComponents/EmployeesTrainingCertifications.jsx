// src/components/EmployeeDetailsComponents/EmployeesTrainingCertifications.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const EmployeesTrainingCertifications = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeTrainingCertificate"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyTrainingCertificate"}/`);
        } else {
          return;
        }
        console.log("User role permission:", res?.data)
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        console.warn("Error fatching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, []);


  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        if (!rolePermissions.view) {
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-training-certificate/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-training-certificate/');
        } else {
          return;
        }
        console.log("Training Certificate List: ", res?.data)
        setTrainings(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("No Training Certificate found, showing empty form.");
        setTrainings([]);
      }
    };

    fetchTrainings();
  }, [rolePermissions]);


  const addNewTraining = () => {
    setTrainings([
      ...trainings,
      {
        id: Date.now(),
        hasTempId: true,
        title: '',
        institution: '',
        issue_date: '',
        type: '',
        credential_id: '',
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


  const handleSave = async (id) => {
    const trainingToSave = trainings.find(edu => edu.id === id);
    if (!trainingToSave) return;
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (trainingToSave.hasTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          delete trainingToSave.id;
          delete trainingToSave.hasTempId;
          const res = await api.post(`employees/employee-training-certificate/${employee_id}/`, trainingToSave);
          console.log("Created Training:", res?.data);
          if(res.status === 201){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Employee Training added successfully.");
          } else {
            alert("Failed to add employee Training.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-training-certificate/${employee_id}/${trainingToSave.id}/`, trainingToSave);
          console.log("Updated Training:", res.data);
          if(res.status === 200){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Employee Training updated successfully.");
          } else {
            alert("Failed to update employee Training.");
          }
        }
      } else if(view.isOwnProfileView) {
        if (trainingToSave.hasTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          delete trainingToSave.id;
          delete trainingToSave.hasTempId;
          const res = await api.post(`employees/my-training-certificate/`, trainingToSave);
          console.log("Created Training:", res?.data);
          if(res.status === 201){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Your Training added successfully.");
          } else {
            alert("Failed to add your Training.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-training-certificate/${trainingToSave.id}/`, trainingToSave);
          console.log("Updated Training:", res?.data);
          if(res.status === 200){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Your Training updated successfully.");
          } else {
            alert("Failed to update your Training.");
          }
        }
      } else {
        alert("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving Training:", error);
      alert("Error saving Training." );
    }
  };


  return (
    <div className="training-details">
      <div className="details-card">
        {trainings.map((training, index) => (
          <div key={training.id} className="training-section">
            <h3 className="section-title">Training/Certifications</h3>
            
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
                  disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
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
                  disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
              <div className="form-group">
                <label>Year*</label>
                <select 
                  className="form-select"
                  value={training.issue_date}
                  onChange={(e) => updateTraining(training.id, 'issue_date', e.target.value)}
                  disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
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
                  disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
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
                  value={training.credential_id}
                  onChange={(e) => updateTraining(training.id, 'credential_id', e.target.value)}
                  disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
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
                    disabled={training.hasTempId ? !rolePermissions.create : !rolePermissions.edit}
                  />
                  <div className="file-display">
                    {training.certificate ? (
                      <a 
                        href={training.certificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="file-name"
                      >
                        {training.certificate.split('/').pop()}
                      </a>
                    ) : (
                      <span className="file-placeholder">
                        Attach File (.pdf / .jpg / .png)
                      </span>
                    )}
                  </div>
              
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                {(training.hasTempId ? rolePermissions.create : rolePermissions.edit) && (
                  <button className="btn-success" onClick={() => handleSave(training.id)}>
                    Save
                  </button>
                )}
              </div>
            </div>
            
          </div>
        ))}

        {/* Add New Training Button */}
        <div className="form-row">
          <div className="form-group">
            {rolePermissions.create && (
              <button type="button" className="btn-primary" onClick={addNewTraining}>
                + Add New Training/Certification
              </button>
            )}
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