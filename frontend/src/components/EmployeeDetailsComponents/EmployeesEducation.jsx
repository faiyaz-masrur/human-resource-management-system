// src/components/EmployeeDetailsComponents/EmployeesEducation.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

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
        const educationsWithNumbers = educationData.map((edu, index) => ({
          ...edu,
          educationNumber: index + 1
        }));
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
      alert("You don't have permission to create");
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
          certificate_name: file.name,
          certificate: URL.createObjectURL(file)
        } : edu
      ));
    }
  };

  // FIXED: Simple file input trigger
  const handleChooseFile = (id) => {
    const fileInput = document.getElementById(`file-input-${id}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // FIXED: Simple and reliable download function
  const handleDownload = (education) => {
    console.log("DOWNLOAD CLICKED for:", education);
    
    if (education.certificate_file) {
      console.log("Downloading file:", education.certificate_file.name);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(education.certificate_file);
      downloadLink.download = education.certificate_file.name;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log("Download should start now");
    } else {
      alert("No file available for download. Please attach a file first.");
    }
  };

  const validateEducation = (education) => {
    if (!education.degree) {
      alert("Degree is required.");
      return false;
    }
    if (!education.institution?.trim()) {
      alert("Institution is required.");
      return false;
    }
    if (!education.passing_year) {
      alert("Passing year is required.");
      return false;
    }
    if (!education.specialization) {
      alert("Specialization is required.");
      return false;
    }
    if (!education.result?.trim()) {
      alert("Result is required.");
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
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-education/${employee_id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 201){
            setEducations(educations.map(edu => 
              edu.id === id ? {...res.data, educationNumber: educationToSave.educationNumber} : edu
            ));
            alert("Employee Education added successfully.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-education/${employee_id}/${educationToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 200){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Employee Education updated successfully.");
          }
        }
      } else if(view.isOwnProfileView) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-education/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 201){
            setEducations(educations.map(edu => 
              edu.id === id ? {...res.data, educationNumber: educationToSave.educationNumber} : edu
            ));
            alert("Your Education added successfully.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-education/${educationToSave.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.status === 200){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Your Education updated successfully.");
          }
        }
      } else {
        alert("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving Education:", error);
      alert("Error saving Education." );
    }
  };

  return (
    <div className="education-container">
      <div className="education-content">
        {/* Education Sections */}
        {(educations.length === 0 ? [{
          id: 'default',
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
        }] : educations).map((education) => (
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
              {/* First Row: Degree, Institution, Passing Year */}
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
                  value={education.institution}
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

              {/* Second Row: Specialization, Result, Certificate */}
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
                  value={education.result}
                  onChange={(e) => updateEducation(education.id, 'result', e.target.value)}
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                />
              </div>

              <div className="input-group">
                <label>Attach Certificate</label>
                
                {/* FIXED: Separate containers for choose file and download */}
                <div className="file-section-separated">
                  {/* Choose File Section */}
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
                  
                  {/* Download Section - Only shows when file exists */}
                  {(education.certificate || education.certificate_file || education.certificate_name) && (
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
                
                {/* Show file name when file is attached */}
                {(education.certificate_name || (education.certificate_file && education.certificate_file.name)) && (
                  <div className="file-name-display">
                    File: {education.certificate_name || education.certificate_file.name}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {(education.isTempId ? rolePermissions.create : rolePermissions.edit) && (
              <div className="save-container">
                <button className="save-btn" onClick={() => handleSave(education.id)}>
                  Save
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add New Education Button */}
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