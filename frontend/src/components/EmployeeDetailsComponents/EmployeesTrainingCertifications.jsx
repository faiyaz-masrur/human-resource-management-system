// src/components/EmployeeDetailsComponents/EmployeesTrainingCertifications.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeesTrainingCertifications = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [trainingTypeList, setTrainingTypeList] = useState([]);
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
        
        const trainingsWithNumbers = trainingData.map((training, index) => {
          let certificate_name = training.certificate_name;
          
          if (!certificate_name && training.certificate) {
            const urlParts = training.certificate.split('/');
            certificate_name = urlParts[urlParts.length - 1];
          }
          
          return {
            ...training,
            trainingNumber: index + 1,
            isTemp: false,
            certificate_name: certificate_name || training.certificate_name,
            certificate_file: null
          };
        });
        
        setTrainings(trainingsWithNumbers); 
      } catch (error) {
        setTrainings([{
          id: `temp-${Date.now()}`,
          isTemp: true,
          title: '',
          institution: '',
          issue_date: '',
          type: '',
          credential_id: '',
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

  useEffect(() => {
    const fetchTrainingTypeList = async () => {
      try {
        const res = await api.get(`system/configurations/training-type-list/`);
        setTrainingTypeList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Training Type List", error);
        setTrainingTypeList([]);
      }
    };

    fetchTrainingTypeList();
  }, []);

  const isTempTraining = (training) => {
    return training.isTemp || (typeof training.id === 'string' && training.id.startsWith('temp-'));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    console.log("File selected for training:", id, file);
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size must be less than 5MB");
        event.target.value = '';
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.warning("Please select a valid file type (JPEG, PNG, PDF)");
        event.target.value = '';
        return;
      }

      setTrainings(trainings.map(training => 
        training.id === id ? { 
          ...training, 
          certificate_file: file,
          certificate_name: file.name
        } : training
      ));
      
      toast.success("File attached successfully!");
    }
  };

  const handleDownload = async (training) => {
    try {
      console.log("Downloading file for training:", training);
      
      if (training.certificate_file && training.certificate_file instanceof File) {
        const url = URL.createObjectURL(training.certificate_file);
        const a = document.createElement('a');
        a.href = url;
        a.download = training.certificate_name || 'certificate';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("File downloaded successfully");
        return;
      }

      if (training.certificate && typeof training.certificate === 'string') {
        if (training.certificate.startsWith('http')) {
          window.open(training.certificate, '_blank');
          toast.success("Opening file in new tab");
        } else {
          const fullUrl = `http://127.0.0.1:8000${training.certificate.startsWith('/') ? '' : '/'}${training.certificate}`;
          window.open(fullUrl, '_blank');
          toast.success("Opening file in new tab");
        }
        return;
      }

      toast.warning("No file available to download");
      
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const addNewTraining = () => {
    if (!rolePermissions.create) {
      toast.warning("You don't have permission to create");
      return;
    }

    const newTrainingNumber = trainings.length + 1;
    setTrainings([
      ...trainings,
      {
        id: `temp-${Date.now()}`,
        isTemp: true,
        title: '',
        institution: '',
        issue_date: '',
        type: '',
        credential_id: '',
        certificate_file: null,
        certificate_name: null,
        trainingNumber: newTrainingNumber
      }
    ]);
  };

  const removeTraining = async (id) => {
    const trainingToDelete = trainings.find(t => t.id === id);
    if (!trainingToDelete) return;

    if (isTempTraining(trainingToDelete)) {
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
      return;
    }

    try {
      if (!rolePermissions.delete) {
        toast.warning("You don't have permission to delete");
        return;
      }

      if (view.isOwnProfileView) {
        await api.delete(`employees/my-training-certificate/${id}/`);
      } else if (employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        await api.delete(`employees/employee-training-certificate/${employee_id}/${id}/`);
      }
      
      toast.success("Training deleted successfully");
      
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
    } catch (error) {
      console.error("Error deleting training:", error);
      if (error.response?.status === 404) {
        toast.error("Training not found. It may have already been deleted.");
      } else {
        toast.error("Failed to delete training");
      }
    }
  };

  const updateTraining = (id, field, value) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, [field]: value } : training
    ));
  };

  const validateTraining = (training) => {
    if (!training.title?.trim()) {
      toast.warning("Title is required.");
      return false;
    }
    if (!training.institution?.trim()) {
      toast.warning("Institution is required.");
      return false;
    }
    if (!training.issue_date) {
      toast.warning("Issue Date is required.");
      return false;
    }
    if (!training.type) {
      toast.warning("Type is required.");
      return false;
    }
    
    return true;
  };

  const handleSave = async (id) => {
    const trainingToSave = trainings.find(training => training.id === id);
    if (!trainingToSave) return;
    if (!validateTraining(trainingToSave)) return;
    
    console.log("Training to save:", trainingToSave);
    
    const formData = new FormData();
    formData.append('title', trainingToSave.title);
    formData.append('institution', trainingToSave.institution);
    formData.append('issue_date', trainingToSave.issue_date);
    formData.append('type', trainingToSave.type);
    
    if (trainingToSave.credential_id) {
      formData.append('credential_id', trainingToSave.credential_id);
    }
    
    if (trainingToSave.certificate_file) {
      formData.append('certificate', trainingToSave.certificate_file);
    }

    try {
      let response;
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (isTempTraining(trainingToSave)) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          response = await api.post(`employees/employee-training-certificate/${employee_id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Created Training Response:", response?.data);
          if(response.status === 201){
            let certificate_name = trainingToSave.certificate_name;
            if (!certificate_name && response.data.certificate) {
              const urlParts = response.data.certificate.split('/');
              certificate_name = urlParts[urlParts.length - 1];
            }
            
            setTrainings(trainings.map(training => 
              training.id === id ? {
                ...response.data, 
                trainingNumber: trainingToSave.trainingNumber, 
                isTemp: false,
                certificate_name: certificate_name || trainingToSave.certificate_name,
                certificate_file: null
              } : training
            ));
            toast.success("Training added successfully.");
          } else {
            toast.error("Failed to add training!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          response = await api.put(`employees/employee-training-certificate/${employee_id}/${trainingToSave.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Updated Training Response:", response.data);
          if(response.status === 200){
            let certificate_name = trainingToSave.certificate_name;
            if (!certificate_name && response.data.certificate) {
              const urlParts = response.data.certificate.split('/');
              certificate_name = urlParts[urlParts.length - 1];
            }
            
            setTrainings(trainings.map(training => 
              training.id === id ? {
                ...response.data, 
                trainingNumber: trainingToSave.trainingNumber,
                certificate_name: certificate_name || trainingToSave.certificate_name,
                certificate_file: null
              } : training
            ));
            toast.success("Training updated successfully.");
          } else {
            toast.error("Failed to update training!");
          }
        }
      } else if(view.isOwnProfileView) {
        if (isTempTraining(trainingToSave)) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          response = await api.post(`employees/my-training-certificate/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Created Training Response:", response?.data);
          if(response.status === 201){
            let certificate_name = trainingToSave.certificate_name;
            if (!certificate_name && response.data.certificate) {
              const urlParts = response.data.certificate.split('/');
              certificate_name = urlParts[urlParts.length - 1];
            }
            
            setTrainings(trainings.map(training => 
              training.id === id ? {
                ...response.data, 
                trainingNumber: trainingToSave.trainingNumber, 
                isTemp: false,
                certificate_name: certificate_name || trainingToSave.certificate_name,
                certificate_file: null
              } : training
            ));
            toast.success("Training added successfully.");
          } else {
            toast.error("Failed to add training!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          response = await api.put(`employees/my-training-certificate/${trainingToSave.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Updated Training Response:", response?.data);
          if(response.status === 200){
            let certificate_name = trainingToSave.certificate_name;
            if (!certificate_name && response.data.certificate) {
              const urlParts = response.data.certificate.split('/');
              certificate_name = urlParts[urlParts.length - 1];
            }
            
            setTrainings(trainings.map(training => 
              training.id === id ? {
                ...response.data, 
                trainingNumber: trainingToSave.trainingNumber,
                certificate_name: certificate_name || trainingToSave.certificate_name,
                certificate_file: null
              } : training
            ));
            toast.success("Training updated successfully.");
          } else {
            toast.error("Failed to update training!");
          }
        }
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving Training:", error);
      if (error.response?.status === 404) {
        toast.error("API endpoint not found. Please check if the training exists.");
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat();
          toast.error(`Validation error: ${errorMessages.join(', ')}`);
        } else {
          toast.error("Invalid data. Please check all fields and try again.");
        }
      } else {
        toast.error("Error saving Training. Please try again.");
      }
    }
  };

  return (
    <div className="training-certifications">
      <div className="training-container">
        <div className="section-header">
          <h2>Training/Certifications</h2>
        </div>

        {trainings.map((training) => {
          const isTemp = isTempTraining(training);
          const hasCertificate = training.certificate || training.certificate_name || training.certificate_file;
          const displayFileName = training.certificate_name || 
            (training.certificate ? training.certificate.split('/').pop() : null);
          
          return (
            <div key={training.id} className="training-section">
              <div className="training-header">
                <span>Training/Certifications {training.trainingNumber}</span>
                
                {trainings.length > 1 && (
                  <button 
                    className="remove-training-btn"
                    onClick={() => removeTraining(training.id)}
                    title="Remove this training/certification"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* First Row: Title, Institution, Year */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Title*</label>
                  <input 
                    type="text" 
                    className="field-input"
                    placeholder="Enter Training or Certification Name"
                    value={training.title || ""}
                    onChange={(e) => updateTraining(training.id, 'title', e.target.value)}
                    disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Institution*</label>
                  <input 
                    type="text" 
                    className="field-input"
                    placeholder="Enter Institution Name"
                    value={training.institution || ""}
                    onChange={(e) => updateTraining(training.id, 'institution', e.target.value)}
                    disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Year*</label>
                  <select 
                    className="field-select"
                    value={training.issue_date || ""}
                    onChange={(e) => updateTraining(training.id, 'issue_date', e.target.value)}
                    disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {Array.from({length: 30}, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              {/* Second Row: Type, Credential ID, Certificate */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Type*</label>
                  <select 
                    className="field-select"
                    value={training.type || ""}
                    onChange={(e) => updateTraining(training.id, 'type', e.target.value)}
                    disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {trainingTypeList.map((trainingType) => (
                      <option key={trainingType.id} value={trainingType.id}>{trainingType.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Credential ID or Reference ID</label>
                  <input 
                    type="text" 
                    className="field-input"
                    placeholder="Enter ID/Reference/Tracking Number"
                    value={training.credential_id || ""}
                    onChange={(e) => updateTraining(training.id, 'credential_id', e.target.value)}
                    disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
                  />
                </div>



<div className="form-field">
  <label className="field-label">Attach Certificate</label>
  <div className="file-input-wrapper">
    <input 
      className="file-input-hidden"
      type="file" 
      id={`certificate-${training.id}`}
      accept=".pdf,.jpg,.png" 
      onChange={(e) => handleFileChange(training.id, e)}
      disabled={isTemp ? !rolePermissions.create : !rolePermissions.edit}
    />
    
    {/* FIXED: Make the file display area clickable for re-attaching */}
    {hasCertificate ? (
      <label 
        htmlFor={`certificate-${training.id}`} 
        className="file-display-with-download"
        style={{cursor: 'pointer'}}
      >
        <div className="file-info">
          <span className="file-name" title={displayFileName}>
            {displayFileName}
          </span>
        </div>
        <div className="file-actions">
          <button 
            className="download-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(training);
            }}
            title="Download"
            type="button"
          >
            ↓
          </button>
        </div>
      </label>
    ) : (
      <label 
        htmlFor={`certificate-${training.id}`} 
        className="file-label"
      >
        Attach File (.pdf / .jpg / .png)
      </label>
    )}
  </div>
</div>
              </div>

              {(isTemp ? rolePermissions.create : rolePermissions.edit) && (
                <div className="save-container">
                  <button className="save-btn" onClick={() => handleSave(training.id)}>
                    Save
                  </button>
                </div>
              )}

              {training.trainingNumber < trainings.length && (
                <hr className="divider" />
              )}
            </div>
          );
        })}

        {rolePermissions.create && (
          <div className="add-new-section">
            <button className="add-new-btn" onClick={addNewTraining}>
              + Add New Training/Certification
            </button>
          </div>
        )}

       {/* Navigation Buttons - Fixed order */}
{/* Navigation Buttons - Fixed */}
<div className="navigation-buttons">
  <div style={{display: 'flex', gap: '10px', marginLeft: 'auto'}}>
    <button className="back-btn" onClick={onBack}>Back</button>
    <button className="next-btn" onClick={onNext}>Next</button>
  </div>
</div>
      </div>
    </div>
  );
}

export default EmployeesTrainingCertifications;