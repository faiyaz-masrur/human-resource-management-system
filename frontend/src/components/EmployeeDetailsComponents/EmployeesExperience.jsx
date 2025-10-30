// src/components/EmployeeDetailsComponents/EmployeesExperience.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeesExperience = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        if (!user?.role) return;
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeWorkExperience"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyWorkExperience"}/`);
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
  }, [user?.role]);


  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        if (!rolePermissions.view) {
          setExperiences([]);
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-work-experience/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-work-experience/');
        } else {
          return;
        }
        const experienceData = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        setExperiences(experienceData); 
      } catch (error) {
        console.warn("No work experiences found, showing empty form.");
        setExperiences([]);
      }
    };

    fetchExperiences();
  }, [rolePermissions]);

  const addNewExperience = () => {
    if (!rolePermissions.create) {
      toast.warning("You don't have permission to create");
      return;
    }
    
    const newExperience = {
      id: `temp-${Date.now()}`, // More explicit temp ID
      isTempId: true,
      organization: '',
      designation: '',
      department: '',
      start_date: '',
      end_date: '',
      responsibilities: ''
    };
    
    console.log("Adding new experience:", newExperience); // DEBUG
    
    setExperiences([
      ...experiences,
      newExperience
    ]);
  };

  const removeExperience = async (id, isTempId) => {
    // If it's not a temporary ID (already saved in database), delete from backend
    if (!isTempId) {
      try {
        if (!rolePermissions.delete) {
          alert("You don't have permission to delete.");
          return;
        }

        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
          await api.delete(`employees/employee-work-experience/${employee_id}/${id}/`);
        } else if(view.isOwnProfileView) {
          await api.delete(`employees/my-work-experience/${id}/`);
        }
        
        alert("Experience deleted successfully.");
      } catch (error) {
        console.error("Error deleting experience:", error);
        alert("Error deleting experience.");
        return;
      }
    }

    // Remove from UI (both temporary and saved experiences)
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    } else {
      alert("You need to have at least one experience section.");
    }
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };


  const validateExperience = (experience) => {
    if (!experience.organization?.trim()) {
      toast.warning("Organization name is required.");
      return false;
    }
    if (!experience.designation?.trim()) {
      toast.warning("Designation is required.");
      return false;
    }
    if (!experience.department?.trim()) {
      toast.warning("Department is required.");
      return false;
    }
    if (!experience.start_date) {
      toast.warning("Start date is required.");
      return false;
    }
    
    return true;
  };


  const handleSave = async (id) => {
    const experienceToSave = experiences.find(exp => exp.id === id);
    if (!experienceToSave) return;
    if (!validateExperience(experienceToSave)) return;
    console.log("Experience to save:", experienceToSave);
    const saveData = {
      organization: experienceToSave?.organization,
      designation: experienceToSave?.designation,
      department: experienceToSave?.department,
      start_date: experienceToSave?.start_date,
      end_date: experienceToSave.end_date ? experienceToSave.end_date : null,
      responsibilities: experienceToSave?.responsibilities,
    }
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)) {
        if (experienceToSave.isTempId) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-work-experience/${employee_id}/`, saveData);
          console.log("Created Experience:", res.data);
          if(res.status === 201){
            setExperiences(experiences.map(exp => 
              exp.id === id ? res.data : exp
            ));
            toast.success("Work experience added successfully.");
          } else {
            toast.error("Failed to add work experience!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-work-experience/${employee_id}/${experienceToSave.id}/`, saveData);
          console.log("Updated Experience:", res.data);
          if(res.status === 200){
            setExperiences(experiences.map(exp => 
              exp.id === id ? res.data : exp
            ));
            toast.success("Work experience updated successfully.");
          } else {
            toast.error("Failed to update Work experience!");
          }
        }
      } else if(view.isOwnProfileView) {
        if (experienceToSave.isTempId) {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-work-experience/`, saveData);
          console.log("Created Experience:", res.data);
          if(res.status === 201){
            setExperiences(experiences.map(exp => 
              exp.id === id ? res.data : exp
            ));
            toast.success("Work experience added successfully.");
          } else {
            toast.error("Failed to add work experience!");
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-work-experience/${experienceToSave.id}/`, saveData);
          console.log("Updated Experience:", res.data);
          if(res.status === 200){
            setExperiences(experiences.map(exp => 
              exp.id === id ? res.data : exp
            ));
            toast.success("Work experience updated successfully.");
          } else {
            toast.error("Failed to update work experience!");
          }
        }
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("Error saving experience!" );
    }
  };

  return (
    <div className="experience-container">
      {/* Main Content */}
      <div className="experience-content">
        {/* Previous Experience Sections */}
        {(experiences.length === 0 ? [{
          id: 'default',
          isTempId: true,
          organization: '',
          designation: '',
          department: '',
          start_date: '',
          end_date: '',
          responsibilities: ''
        }] : experiences).map((experience, index) => (
          <div key={experience.id} className="experience-block">
            <div className="experience-header">
              <span>{experiences.length === 1 ? "Previous Experience" : `Previous Experience ${index + 1}`}</span>
              
              {/* Delete Button - Show only if more than one experience exists */}
              {experiences.length > 1 && (
                <button 
                  className="delete-experience-btn"
                  onClick={() => removeExperience(experience.id, experience.isTempId)}
                  title="Delete this experience"
                >
                  ×
                </button>
              )}
            </div>
            
            <div className="form-grid">
              {/* First Row - Three Fields */}
              <div className="input-group">
                <label>Organization Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter Organization Name"
                  value={experience.organization || ""}
                  onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                />
              </div>
              
              <div className="input-group">
                <label>Designation*</label>
                <input 
                  type="text" 
                  placeholder="Enter Designation"
                  value={experience.designation || ""}
                  onChange={(e) => updateExperience(experience.id, 'designation', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                />
              </div>
              
              <div className="input-group">
                <label>Department/Division*</label>
                <input 
                  type="text" 
                  placeholder="Enter Department Name"
                  value={experience.department || ""}
                  onChange={(e) => updateExperience(experience.id, 'department', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                />
              </div>

              {/* Second Row - Two Date Fields with Calendar */}
              <div className="input-group">
                <label>Start Date*</label>
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.start_date || ""}
                  onChange={(e) => updateExperience(experience.id, 'start_date', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                />
              </div>
              
              <div className="input-group">
                <label>End Date*</label>
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.end_date || ""}
                  onChange={(e) => updateExperience(experience.id, 'end_date', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                />
              </div>

              {/* Job Responsibilities - Full Width */}
              <div className="input-group full-width">
                <label>Job Responsibilities</label>
                <textarea 
                  placeholder="Write the job context here"
                  rows="4"
                  value={experience.responsibilities || ""}
                  onChange={(e) => updateExperience(experience.id, 'responsibilities', e.target.value)}
                  disabled={!rolePermissions.edit && !experience.isTempId}
                ></textarea>
              </div>
            </div>

            {/* Save Button - Moved to left side */}
            {(experience.isTempId ? rolePermissions.create : rolePermissions.edit) && (
              <div className="save-button-container">
                <button className="save-btn" onClick={() => handleSave(experience.id)}>
                  Save
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add New Experience Button */}
        {rolePermissions.create && (
          <div className="add-experience-container">
            <button className="add-experience-btn" onClick={addNewExperience}>
              + Add New Experience
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Back button on right side before Next */}
      <div className="navigation-buttons">
        <div className="left-buttons">
          {/* Additional left buttons can go here if needed */}
        </div>
        <div className="right-buttons">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button className="next-btn" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesExperience;