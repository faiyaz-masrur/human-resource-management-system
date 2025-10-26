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
        console.log("User role permission:", res?.data)
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        console.warn("Error fatching role permissions", error);
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
        console.log("Experiences List: ", res?.data)
        setExperiences(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
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


  const removeExperience = (id) => {
    if (previousExperiences.length > 1) {
      setPreviousExperiences(previousExperiences.filter(exp => exp.id !== id));
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
    <div className="experience-details">
      <div className="details-card">
        {/* Previous Experiences Section */}
        {experiences.map((experience) => (
          <div key={experience.id} className="experience-section">
            <h3 className="section-title">
              {
              experience.organization === "Sonali Intellect Limited"
              ?
                "Current Experience"
              :
                "Previous Experience"
              }
            </h3>
            
            {/* Organization, Designation Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Organization Name*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Organization Name"
                  value={experience.organization || ""}
                  onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
              <div className="form-group">
                <label>Designation*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Designation"
                  value={experience.designation || ""}
                  onChange={(e) => updateExperience(experience.id, 'designation', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department/Division*</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Department Name"
                  value={experience.department || ""}
                  onChange={(e) => updateExperience(experience.id, 'department', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
            </div>

            {/* Start Date, End Date Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Start Date*</label>
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.start_date || ""}
                  onChange={(e) => updateExperience(experience.id, 'start_date', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date*</label> 
                <input 
                  type="date" 
                  className="date-input"
                  value={experience.end_date || ""}
                  onChange={(e) => updateExperience(experience.id, 'end_date', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                />
              </div>
            </div>

            {/* Job Responsibilities */}
            <div className="form-row">
              <div className="form-group full-width">
                <label>Job Responsibilities</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Write the job context here"
                  rows="4"
                  value={experience.responsibilities || ""}
                  onChange={(e) => updateExperience(experience.id, 'responsibilities', e.target.value)}
                  disabled={experience.isTempId ? !rolePermissions.create : !rolePermissions.edit}
                ></textarea>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                {(experience.isTempId ? rolePermissions.create : rolePermissions.edit) && (
                  <button className="btn-success" onClick={() => handleSave(experience.id)}>
                    Save
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}

        {/* Add New Experience Button */}
        <div className="form-row">
          <div className="form-group">
            {rolePermissions.create && (
              <button type="button" className="btn-primary" onClick={addNewExperience}>
                + Add New Experience
              </button>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button className="btn-primary" onClick={onNext}>Next</button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesExperience;