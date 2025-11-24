// src/components/EmployeeDetailsComponents/EmployeesEducation.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeesEducation = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const [educations, setEducations] = useState([]);
  const [degreeList, setDegreeList] = useState([]);
  const [specializationList, setSpecializationList] = useState([])
  const [rolePermissions, setRolePermissions] = useState({});
  const [showCustomDegree, setShowCustomDegree] = useState({});

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeEducation"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyEducation"}/`);
        } else {
          return;
        }
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        console.warn("Error fetching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, []);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        if (!rolePermissions.view) {
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-education/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-education/');
        } else {
          return;
        }
        const educationData = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        
        // Transform server response to preserve file information
        const educationsWithNumbers = educationData.map((edu, index) => {
          // Extract file name from certificate URL if certificate_name is not available
          let certificate_name = edu.certificate_name;
          if (!certificate_name && edu.certificate) {
            const urlParts = edu.certificate.split('/');
            certificate_name = urlParts[urlParts.length - 1];
          }
          
          // FIX: If custom_degree exists, set degree to 'other' to show the custom input
          const hasCustomDegree = edu.custom_degree && edu.custom_degree.trim() !== '';
          const degreeValue = hasCustomDegree ? 'other' : (edu.degree || '');
          
          setShowCustomDegree(prev => ({
            ...prev,
            [edu.id]: hasCustomDegree
          }));
          
          return {
            ...edu,
            degree: degreeValue, // FIX: Set to 'other' if custom degree exists
            educationNumber: index + 1,
            // Ensure file information is preserved
            certificate_name: certificate_name || edu.certificate_name,
            certificate_file: null // File object is only for new uploads
          };
        });
        
        setEducations(educationsWithNumbers); 
      } catch (error) {
        console.warn("No education found, showing empty form.");
        setEducations([]);
      }
    };

    fetchEducations();
  }, [rolePermissions, employee_id]);

  useEffect(() => {
    const fetchDegreeList = async () => {
      try {
        const res = await api.get(`system/configurations/degree-list/`);
        setDegreeList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Degree List", error);
        setDegreeList([]);
      }
    };

    fetchDegreeList();
  }, []);

  useEffect(() => {
    const fetchSpecializationList = async () => {
      try {
        const res = await api.get(`system/configurations/specialization-list/`);
        setSpecializationList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Specialization List", error);
        setSpecializationList([]);
      }
    };

    fetchSpecializationList();
  }, []);

  const addNewEducation = () => {
    if (!rolePermissions.create) {
      toast.warning("You don't have permission to create");
      return;
    }
    const newEducationNumber = educations.length + 1;
    const tempId = `temp-${Date.now()}`;
    
    setEducations([
      ...educations,
      {
        id: tempId,
        isTempId: true,
        degree: '',
        custom_degree: '',
        institution: '',
        passing_year: '',
        specialization: '',
        result: '',
        certificate: null,
        certificate_file: null,
        certificate_name: null,
        educationNumber: newEducationNumber
      }
    ]);
    
    // Initialize custom degree state for this education
    setShowCustomDegree(prev => ({
      ...prev,
      [tempId]: false
    }));
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter(edu => edu.id !== id);
      const renumberedEducations = updatedEducations.map((edu, index) => ({
        ...edu,
        educationNumber: index + 1
      }));
      setEducations(renumberedEducations);
      
      // Remove from custom degree state
      setShowCustomDegree(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } else {
      alert("You need to have at least one education section.");
    }
  };

  const updateEducation = (id, field, value) => {
    setEducations(educations.map(edu => {
      if (edu.id === id) {
        const updatedEducation = { ...edu, [field]: value };
        
        // Only handle custom degree logic when degree field changes
        if (field === 'degree') {
          // Show/hide custom degree input based on selection
          setShowCustomDegree(prev => ({
            ...prev,
            [id]: value === 'other'
          }));
          
          // Clear custom degree when switching away from "other"
          if (value !== 'other') {
            updatedEducation.custom_degree = '';
          }
        }
        
        return updatedEducation;
      }
      return edu;
    }));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    console.log("File selected:", file);
    
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
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }

      setEducations(educations.map(edu => 
        edu.id === id ? { 
          ...edu, 
          certificate_file: file,
          certificate_name: file.name
        } : edu
      ));
    }
  };

  // Helper function to get file name
  const getFileName = (file) => {
    if (!file) return null;
    
    // If it's a File object (new upload)
    if (file instanceof File) {
      return file.name;
    }
    
    // If it's a string URL (from API response)
    if (typeof file === 'string') {
      return file.split('/').pop();
    }
    
    return null;
  };

  // Helper function to check if file exists and is displayable
  const hasFile = (file) => {
    return file && (file instanceof File || typeof file === 'string');
  };

  // Download file function
  const downloadFile = async (file, fieldName) => {
    try {
      if (file instanceof File) {
        // For newly uploaded files (File objects)
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (typeof file === 'string') {
        // For files from API (URL strings) - fetch and download
        const response = await fetch(file);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getFileName(file) || `${fieldName}.${file.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab if download fails
      if (typeof file === 'string') {
        window.open(file, '_blank');
      }
    }
  };

  const validateEducation = (education) => {
    // Check if degree is selected OR custom degree is provided
    if (!education.degree && !education.custom_degree?.trim()) {
      toast.warning("Degree is required.");
      return false;
    }
    
    // If "Other" is selected, custom degree must be filled
    if (education.degree === 'other' && !education.custom_degree?.trim()) {
      toast.warning("Please specify your degree name.");
      return false;
    }
    
    if (!education.institution?.trim()) {
      toast.warning("Institution is required.");
      return false;
    }
    if (!education.passing_year) {
      toast.warning("Passing year is required.");
      return false;
    }
    if (!education.specialization) {
      toast.warning("Specialization is required.");
      return false;
    }
    if (!education.result?.trim()) {
      toast.warning("Result is required.");
      return false;
    }
    
    return true;
  };

  const handleSave = async (id) => {
    const educationToSave = educations.find(edu => edu.id === id);
    if (!educationToSave) return;
    if (!validateEducation(educationToSave)) return;
    
    const formData = new FormData();
    
    // Handle degree logic: if "other" is selected, send custom_degree and set degree to null
    if (educationToSave.degree === 'other') {
      formData.append('custom_degree', educationToSave.custom_degree);
      formData.append('degree', ''); // Clear the degree field
    } else {
      formData.append('degree', educationToSave.degree);
      formData.append('custom_degree', ''); // Clear custom_degree field
    }
    
    formData.append('institution', educationToSave.institution);
    formData.append('passing_year', educationToSave.passing_year);
    formData.append('specialization', educationToSave.specialization);
    formData.append('result', educationToSave.result);
    
    if (educationToSave.certificate_file) {
      formData.append('certificate', educationToSave.certificate_file);
    }

    try {
      let response;
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          response = await api.post(`employees/employee-education/${employee_id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(response.status === 201){
            // Preserve file information when updating state
            setEducations(educations.map(edu => 
              edu.id === id ? {
                ...response.data, 
                educationNumber: educationToSave.educationNumber,
                // PRESERVE FILE INFORMATION
                certificate_file: educationToSave.certificate_file,
                certificate_name: educationToSave.certificate_name,
                certificate: response.data.certificate || educationToSave.certificate
              } : edu
            ));
            
            // Update custom degree state
            const hasCustomDegree = response.data.custom_degree && response.data.custom_degree.trim() !== '';
            setShowCustomDegree(prev => ({
              ...prev,
              [response.data.id]: hasCustomDegree
            }));
            
            toast.success("Education added successfully.");
          } else {
            toast.error("Failed to add education!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          response = await api.put(`employees/employee-education/${employee_id}/${educationToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(response.status === 200){
            // Preserve file information when updating state
            setEducations(educations.map(edu => 
              edu.id === id ? {
                ...response.data,
                educationNumber: educationToSave.educationNumber,
                // PRESERVE FILE INFORMATION
                certificate_file: educationToSave.certificate_file,
                certificate_name: educationToSave.certificate_name,
                certificate: response.data.certificate || educationToSave.certificate
              } : edu
            ));
            
            // Update custom degree state
            const hasCustomDegree = response.data.custom_degree && response.data.custom_degree.trim() !== '';
            setShowCustomDegree(prev => ({
              ...prev,
              [response.data.id]: hasCustomDegree
            }));
            
            toast.success("Education updated successfully.");
          } else {
            toast.error("Failed to update education!");
          }
        }
      } else if(view.isOwnProfileView) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          response = await api.post(`employees/my-education/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(response.status === 201){
            // Preserve file information when updating state
            setEducations(educations.map(edu => 
              edu.id === id ? {
                ...response.data, 
                educationNumber: educationToSave.educationNumber,
                // PRESERVE FILE INFORMATION
                certificate_file: educationToSave.certificate_file,
                certificate_name: educationToSave.certificate_name,
                certificate: response.data.certificate || educationToSave.certificate
              } : edu
            ));
            
            // Update custom degree state
            const hasCustomDegree = response.data.custom_degree && response.data.custom_degree.trim() !== '';
            setShowCustomDegree(prev => ({
              ...prev,
              [response.data.id]: hasCustomDegree
            }));
            
            toast.success("Education added successfully.");
          } else {
            toast.error("Failed to add education!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          response = await api.put(`employees/my-education/${educationToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(response.status === 200){
            // Preserve file information when updating state
            setEducations(educations.map(edu => 
              edu.id === id ? {
                ...response.data,
                educationNumber: educationToSave.educationNumber,
                // PRESERVE FILE INFORMATION
                certificate_file: educationToSave.certificate_file,
                certificate_name: educationToSave.certificate_name,
                certificate: response.data.certificate || educationToSave.certificate
              } : edu
            ));
            
            // Update custom degree state
            const hasCustomDegree = response.data.custom_degree && response.data.custom_degree.trim() !== '';
            setShowCustomDegree(prev => ({
              ...prev,
              [response.data.id]: hasCustomDegree
            }));
            
            toast.success("Education updated successfully.");
          } else {
            toast.error("Failed to update education!");
          }
        }
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving Education:", error);
      toast.error("Error saving Education." );
    }
  };

  return (
    <div className="education-container">
      <div className="education-content">
        {/* Education Sections */}
        {educations.map((education) => {
          const hasCertificate = education.certificate_file || education.certificate_name || education.certificate;
          const displayFileName = education.certificate_name || 
            (education.certificate ? education.certificate.split('/').pop() : null);
          
          return (
            <div key={education.id} className="education-block">
              <div className="education-header">
                <span>Education {education.educationNumber}</span>
                
                {educations.length > 1 && (
                  <button 
                    className="delete-education-btn"
                    onClick={() => removeEducation(education.id)}
                    title="Delete this education"
                  >
                     Remove
                  </button>
                )}
              </div>
              
              <div className="education-grid">
                {/* Updated Degree Section with Other Option */}
                <div className="input-group">
                  <label>Degree*</label>
                  <select 
                    value={education.degree || ""} 
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {degreeList.map((degree) => (
                      <option key={degree.id} value={degree.id}>{degree.name}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  
                  {/* Custom Degree Input - Only show when "Other" is selected OR custom_degree exists */}
                  {(showCustomDegree[education.id] || education.custom_degree) && (
                    <div className="custom-degree-input" style={{marginTop: '8px'}}>
                      <input 
                        type="text" 
                        placeholder="Please specify your degree name"
                        value={education.custom_degree || ""}
                        onChange={(e) => updateEducation(education.id, 'custom_degree', e.target.value)}
                        disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label>Institution*</label>
                  <input 
                    type="text" 
                    placeholder="Enter Institution Name"
                    value={education.institution || ""}
                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  />
                </div>

                <div className="input-group">
                  <label>Passing Year*</label>
                  <select 
                    value={education.passing_year || ""}
                    onChange={(e) => updateEducation(education.id, 'passing_year', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {Array.from({length: 40}, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>

                <div className="input-group">
                  <label>Specialization*</label>
                  <select 
                    value={education.specialization || ""}
                    onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {specializationList.map((specialization) => (
                      <option key={specialization.id} value={specialization.id}>{specialization.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Result/Grade*</label>
                  <input 
                    type="text" 
                    placeholder="Enter Division or CGPA or Grade"
                    value={education.result || ""}
                    onChange={(e) => updateEducation(education.id, 'result', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  />
                </div>

                {/* Certificate Attachment Section */}
                <div className="input-group full-width">
                  <div className="attachment-box">
                    <label>Certificate</label>
                   
                    <div className="file-input-wrapper">
                      <input 
                        className="file-input"
                        type="file" 
                        id={`certificate-${education.id}`}
                        accept=".pdf,.jpg,.png" 
                        onChange={(e) => handleFileChange(education.id, e)}
                        disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                      />
                      {hasCertificate ? (
                        <div className="file-display-with-download">
                          <div className="file-info">
                            <span className="file-name" title={displayFileName}>
                              {displayFileName}
                            </span>
                          </div>
                          <div className="file-actions">
                            <button 
                              className="download-btn"
                              onClick={() => downloadFile(
                                education.certificate_file || education.certificate, 
                                'certificate'
                              )}
                              title="Download"
                              type="button"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor={`certificate-${education.id}`} className="file-label">
                          Attach File (.pdf / .jpg / .png)
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(education.isTempId ? rolePermissions.create : rolePermissions.edit) && (
                <div className="save-container">
                  <button className="save-btn" onClick={() => handleSave(education.id)}>
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {rolePermissions.create && (
          <div className="add-education-container">
            <button className="add-education-btn" onClick={addNewEducation}>
              + Add New Education
            </button>
          </div>
        )}
      </div>

       {/* Navigation Buttons - Back button on right side before Next */}
      <div className="navigation-buttons">
        <div className="left-buttons">
        </div>
        <div className="right-buttons">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button className="next-btn" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesEducation;