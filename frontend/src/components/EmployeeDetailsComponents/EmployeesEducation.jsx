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
        console.log("Education List: ", res?.data)
        setEducations(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
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
        console.log("Degree list:", res?.data)
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
        console.log("Specialization list:", res?.data)
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
    setEducations([
      ...educations,
      {
        id: `temp-${Date.now()}`, // More explicit temp ID
        isTempId: true,
        degree: '',
        institution: '',
        passing_year: '',
        specialization: '',
        result: '',
        certificate: null
      }
    ]);
  };


  const removeExperience = (id) => {
    if (previousExperiences.length > 1) {
      setPreviousExperiences(previousExperiences.filter(exp => exp.id !== id));
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
      alert("specialization is required.");
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
    console.log("Education to save:", educationToSave);
    const saveData = {
      degree: educationToSave?.degree,
      institution: educationToSave?.institution,
      passing_year: educationToSave?.passing_year,
      specialization: educationToSave?.specialization,
      result: educationToSave?.result,
      certificate: educationToSave.certificate ? educationToSave.certificate : null,
    }
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-education/${employee_id}/`, saveData);
          console.log("Created Education:", res?.data);
          if(res.status === 201){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Employee Education added successfully.");
          } else {
            alert("Failed to add employee Education.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-education/${employee_id}/${educationToSave.id}/`, saveData);
          console.log("Updated Education:", res.data);
          if(res.status === 200){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Employee Education updated successfully.");
          } else {
            alert("Failed to update employee Education.");
          }
        }
      } else if(view.isOwnProfileView) {
        if (educationToSave.isTempId) {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-education/`, saveData);
          console.log("Created Education:", res?.data);
          if(res.status === 201){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Your Education added successfully.");
          } else {
            alert("Failed to add your Education.");
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-education/${educationToSave.id}/`, saveData);
          console.log("Updated Education:", res?.data);
          if(res.status === 200){
            setEducations(educations.map(edu => 
              edu.id === id ? res.data : edu
            ));
            alert("Your Education updated successfully.");
          } else {
            alert("Failed to update your Education.");
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
    <div className="education-details">
      <div className="details-card">
        {educations.map((education, index) => (
          <div key={education.id} className="education-section">
            <h3 className="section-title">Education</h3>
            
            {/* First Row: Degree, Institution, Passing Year */}
            <div className="form-row">
              <div className="form-group">
                <label>Degree*</label>
                <select 
                  className="form-select"
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                >
                  <option value="">-- Select --</option>
                  {degreeList.map((degree)=>(
                    <option key={degree.id} value={degree.id}>{degree.name}</option>
                  ))}
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
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
              <div className="form-group">
                <label>Passing Year*</label>
                <select 
                  className="form-select"
                  value={education.passing_year}
                  onChange={(e) => updateEducation(education.id, 'passing_year', e.target.value)}
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
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
            </div>

            {/* Second Row: Specialization, Result, Certificate */}
            <div className="form-row">
              <div className="form-group">
                <label>Specialization*</label>
                <select 
                  className="form-select"
                  value={education.specialization}
                  onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                >
                  <option value="">-- Select --</option>
                  {specializationList.map((specialization)=>(
                    <option key={specialization.id} value={specialization.id}>{specialization.name}</option>
                  ))}
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
                  disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
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
                    disabled={education.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  />
                  <div className="file-display">
                    {education.certificate ? (
                      <a 
                        href={education.certificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="file-name"
                      >
                        {education.certificate.split('/').pop()}
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
                {(education.isTempId ? rolePermissions.create : rolePermissions.edit) && (
                  <button className="btn-success" onClick={() => handleSave(education.id)}>
                    Save
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}

        <div className="form-row">
          <div className="form-group">
            {rolePermissions.create && (
              <button type="button" className="btn-primary" onClick={addNewEducation}>
                + Add New Education
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

export default EmployeesEducation;