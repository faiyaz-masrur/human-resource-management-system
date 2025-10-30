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
        
        // FIX: Transform server response to preserve file information
        const educationsWithNumbers = educationData.map((edu, index) => {
          // Extract file name from certificate URL if certificate_name is not available
          let certificate_name = edu.certificate_name;
          if (!certificate_name && edu.certificate) {
            const urlParts = edu.certificate.split('/');
            certificate_name = urlParts[urlParts.length - 1];
          }
          
          return {
            ...edu,
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
  }, [rolePermissions]);

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
    setEducations([
      ...educations,
      {
        id: `temp-${Date.now()}`,
        isTempId: true,
        degree: '',
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
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter(edu => edu.id !== id);
      const renumberedEducations = updatedEducations.map((edu, index) => ({
        ...edu,
        educationNumber: index + 1
      }));
      setEducations(renumberedEducations);
    } else {
      alert("You need to have at least one education section.");
    }
  };

  const updateEducation = (id, field, value) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
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
      if (file.size > 50 * 1024 * 1024) {
        alert("File size should be less than 50MB");
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

  const handleChooseFile = (id) => {
    const fileInput = document.getElementById(`file-input-${id}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDownload = async (education) => {
    try {
      console.log("Downloading file for education:", education);
      
      // If there's a file attached but not saved yet
      if (education.certificate_file && education.certificate_file instanceof File) {
        const url = URL.createObjectURL(education.certificate_file);
        const a = document.createElement('a');
        a.href = url;
        a.download = education.certificate_name || 'certificate';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("File downloaded successfully");
        return;
      }

      // If file is saved on server (has a URL)
      if (education.certificate && typeof education.certificate === 'string') {
        if (education.certificate.startsWith('http')) {
          window.open(education.certificate, '_blank');
          toast.success("Opening file in new tab");
        } else {
          const fullUrl = `http://127.0.0.1:8000${education.certificate.startsWith('/') ? '' : '/'}${education.certificate}`;
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

  const validateEducation = (education) => {
    if (!education.degree) {
      toast.warning("Degree is required.");
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
      toast.warning("specialization is required.");
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
    formData.append('degree', educationToSave.degree);
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
            // FIX: Preserve file information when updating state
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
            // FIX: Preserve file information when updating state
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
            // FIX: Preserve file information when updating state
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
            // FIX: Preserve file information when updating state
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
        {(educations.length === 0 ? [{
          id: `temp-${Date.now()}`,
          isTempId: true,
          degree: '',
          institution: '',
          passing_year: '',
          specialization: '',
          result: '',
          certificate: null,
          certificate_file: null,
          certificate_name: null,
          educationNumber: 1
        }] : educations).map((education) => {
          const hasFile = education.certificate_file || education.certificate_name || education.certificate;
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
                    ×
                  </button>
                )}
              </div>
              
              <div className="education-grid">
                <div className="input-group">
                  <label>Degree*</label>
                  <select 
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  >
                    <option value="">-- Select --</option>
                    {degreeList.map((degree) => (
                      <option key={degree.id} value={degree.id}>{degree.name}</option>
                    ))}
                  </select>
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
                    value={education.passing_year}
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
                    value={education.specialization}
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

                <div className="input-group">
                  <label>Attach Certificate</label>
                  
                  <div className="file-section-separated">
                    <div className="choose-file-section">
                      <input 
                        id={`file-input-${education.id}`}
                        type="file" 
                        className="file-input-hidden"
                        accept=".pdf,.jpg,.png,application/pdf,image/jpeg,image/png"
                        onChange={(e) => handleFileChange(education.id, e)}
                        disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                      />
                      <button 
                        type="button"
                        className="choose-file-btn-separate"
                        onClick={() => handleChooseFile(education.id)}
                      >
                        Choose File
                      </button>
                    </div>
                    
                    {hasFile && (
                      <div className="download-section">
                        <button 
                          type="button"
                          className="download-btn-separate"
                          onClick={() => handleDownload(education)}
                          title="Click to download the attached file"
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {displayFileName && (
                    <div className="file-name-display">
                      ✅ File: {displayFileName}
                      {education.isTempId ? " (Ready to save)" : ""}
                    </div>
                  )}
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

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="next-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default EmployeesEducation;