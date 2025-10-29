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
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, []);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        if (!rolePermissions.view) return;
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-training-certificate/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-training-certificate/');
        } else {
          return;
        }
        const trainingData = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        const trainingsWithNumbers = trainingData.map((training, index) => ({
          ...training,
          trainingNumber: index + 1
        }));
        setTrainings(trainingsWithNumbers); 
      } catch (error) {
        // Initialize with one empty training section
        setTrainings([{
          id: `temp-${Date.now()}`,
          isTempId: true,
          title: '',
          institution: '',
          issue_date: '',
          type: '',
          credential_id: '',
          certificate: null,
          certificate_file: null,
          certificate_name: null,
          trainingNumber: 1
        }]);
      }
    };

    if (rolePermissions.view) {
      fetchTrainings();
    }
  }, [rolePermissions]);

  const addNewTraining = () => {
    if (!rolePermissions.create) {
      alert("You don't have permission to create");
      return;
    }
    const newTrainingNumber = trainings.length + 1;
    setTrainings([
      ...trainings,
      {
        id: `temp-${Date.now()}`,
        isTempId: true,
        title: '',
        institution: '',
        issue_date: '',
        type: '',
        credential_id: '',
        certificate: null,
        certificate_file: null,
        certificate_name: null,
        trainingNumber: newTrainingNumber
      }
    ]);
  };

  const removeTraining = (id) => {
    if (trainings.length > 1) {
      const updatedTrainings = trainings.filter(training => training.id !== id);
      const renumberedTrainings = updatedTrainings.map((training, index) => ({
        ...training,
        trainingNumber: index + 1
      }));
      setTrainings(renumberedTrainings);
    } else {
      alert("You need to have at least one training section.");
    }
  };

  const updateTraining = (id, field, value) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, [field]: value } : training
    ));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    console.log("File selected for training:", id, file);
    
    if (file) {
      // Check file type
      const allowedTypes = ['.pdf', '.jpg', '.png', 'application/pdf', 'image/jpeg', 'image/png'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const fileType = file.type;
      
      if (!allowedTypes.includes(`.${fileExtension}`) && !allowedTypes.includes(fileType)) {
        alert("Please select a valid file type (.pdf, .jpg, .png)");
        return;
      }

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("File size should be less than 50MB");
        return;
      }

      setTrainings(trainings.map(training => 
        training.id === id ? { 
          ...training, 
          certificate_file: file,
          certificate_name: file.name,
          certificate: URL.createObjectURL(file)
        } : training
      ));
    }
  };

  // Simple file input trigger
  const handleChooseFile = (id) => {
    const fileInput = document.getElementById(`file-input-${id}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Clear attached file
  const handleClearFile = (id) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { 
        ...training, 
        certificate_file: null,
        certificate_name: null,
        certificate: null
      } : training
    ));

    // Reset file input
    const fileInput = document.getElementById(`file-input-${id}`);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Simple and reliable download function
  const handleDownload = (training) => {
    console.log("DOWNLOAD CLICKED for:", training);
    
    if (training.certificate_file) {
      console.log("Downloading file:", training.certificate_file.name);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(training.certificate_file);
      downloadLink.download = training.certificate_file.name;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log("Download should start now");
    } else {
      alert("No file available for download. Please attach a file first.");
    }
  };

  const validateTraining = (training) => {
    if (!training.title?.trim()) {
      alert("Title is required.");
      return false;
    }
    if (!training.institution?.trim()) {
      alert("Institution is required.");
      return false;
    }
    if (!training.issue_date) {
      alert("Year is required.");
      return false;
    }
    if (!training.type) {
      alert("Type is required.");
      return false;
    }
    
    return true;
  };

  const handleSave = async (id) => {
    const trainingToSave = trainings.find(training => training.id === id);
    if (!trainingToSave) return;
    if (!validateTraining(trainingToSave)) return;
    
    const formData = new FormData();
    formData.append('title', trainingToSave.title);
    formData.append('institution', trainingToSave.institution);
    formData.append('issue_date', trainingToSave.issue_date);
    formData.append('type', trainingToSave.type);
    formData.append('credential_id', trainingToSave.credential_id || '');
    
    if (trainingToSave.certificate_file) {
      formData.append('certificate', trainingToSave.certificate_file);
    }

    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (trainingToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-training-certificate/${employee_id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 201){
            setTrainings(trainings.map(training => 
              training.id === id ? {...res.data, trainingNumber: trainingToSave.trainingNumber} : training
            ));
            alert("Employee Training/Certification added successfully.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-training-certificate/${employee_id}/${trainingToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 200){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Employee Training/Certification updated successfully.");
          }
        }
      } else if(view.isOwnProfileView) {
        if (trainingToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-training-certificate/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 201){
            setTrainings(trainings.map(training => 
              training.id === id ? {...res.data, trainingNumber: trainingToSave.trainingNumber} : training
            ));
            alert("Your Training/Certification added successfully.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-training-certificate/${trainingToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 200){
            setTrainings(trainings.map(training => 
              training.id === id ? res.data : training
            ));
            alert("Your Training/Certification updated successfully.");
          }
        }
      } else {
        alert("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving Training:", error);
      alert("Error saving Training/Certification.");
    }
  };

  return (
    <div className="training-certifications">
      <div className="training-container">
        <div className="section-header">
          {/* <h2>Training/Certifications</h2> */}
        </div>

        {/* Training Sections */}
        {trainings.map((training) => (
          <div key={training.id} className="training-section">
            {/* Training Header with Remove Button */}
            <div className="training-header">
              <span>Training/Certification {training.trainingNumber}</span>
              
              {trainings.length > 1 && (
                <button 
                  className="delete-training-btn"
                  onClick={() => removeTraining(training.id)}
                  title="Delete this training/certification"
                >
                  ×
                </button>
              )}
            </div>

            {/* First Row: 3 fields */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Title*</label>
                <input 
                  type="text" 
                  className="field-input"
                  placeholder="Enter Training or Certification Name"
                  value={training.title}
                  onChange={(e) => updateTraining(training.id, 'title', e.target.value)}
                  disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                />
              </div>
              
              <div className="form-field">
                <label className="field-label">Institution</label>
                <input 
                  type="text" 
                  className="field-input"
                  placeholder="Enter Institution Name"
                  value={training.institution}
                  onChange={(e) => updateTraining(training.id, 'institution', e.target.value)}
                  disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                />
              </div>
              
              <div className="form-field">
                <label className="field-label">Year</label>
                <select 
                  className="field-select"
                  value={training.issue_date}
                  onChange={(e) => updateTraining(training.id, 'issue_date', e.target.value)}
                  disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                >
                  <option value="">-- Select --</option>
                  {Array.from({length: 30}, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>

            {/* Second Row: 3 fields (Type, Credential ID, Attach Certificate) */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Type</label>
                <select 
                  className="field-select"
                  value={training.type}
                  onChange={(e) => updateTraining(training.id, 'type', e.target.value)}
                  disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                >
                  <option value="">-- Select --</option>
                  <option value="training">Training</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
              
              <div className="form-field">
                <label className="field-label">Credential ID or Reference ID</label>
                <input 
                  type="text" 
                  className="field-input"
                  placeholder="Enter ID/Reference/Tracking Number"
                  value={training.credential_id}
                  onChange={(e) => updateTraining(training.id, 'credential_id', e.target.value)}
                  disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Attach Certificate</label>
                
                {/* File Section with separate choose file and download */}
                <div className="file-section-separated">
                  {/* Choose File Section */}
                  <div className="choose-file-section">
                    <input 
                      id={`file-input-${training.id}`}
                      type="file" 
                      className="file-input-hidden"
                      accept=".pdf,.jpg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileChange(training.id, e)}
                      disabled={training.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                    />
                    <button 
                      type="button"
                      className="choose-file-btn-separate"
                      onClick={() => handleChooseFile(training.id)}
                    >
                      Choose File
                    </button>
                  </div>
                  
                  {/* Action Buttons - Show when file exists */}
                  {(training.certificate || training.certificate_file || training.certificate_name) && (
                    <div className="file-action-buttons">
                      <button 
                        type="button"
                        className="download-btn-separate"
                        onClick={() => handleDownload(training)}
                        title="Click to download the attached file"
                      >
                        Download
                      </button>
                      {/* <button 
                        type="button"
                        className="clear-file-btn"
                        onClick={() => handleClearFile(training.id)}
                        title="Remove attached file"
                      >
                        
                      </button> */}
                    </div>
                  )}
                </div>
                
                {/* Show file name when file is attached */}
                {(training.certificate_name || (training.certificate_file && training.certificate_file.name)) && (
                  <div className="file-name-display">
                    File: {training.certificate_name || training.certificate_file.name}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {(training.isTempId ? rolePermissions.create : rolePermissions.edit) && (
              <div className="save-container">
                <button className="save-btn" onClick={() => handleSave(training.id)}>
                  Save
                </button>
              </div>
            )}

            <div className="divider"></div>
          </div>
        ))}

        {/* Add New Button */}
        <div className="add-new-section">
          {rolePermissions.create && (
            <button className="add-new-btn" onClick={addNewTraining}>
              + Add New Training/Certification
            </button>
          )}
        </div>

        <div className="navigation-buttons">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button className="next-btn" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesTrainingCertifications;