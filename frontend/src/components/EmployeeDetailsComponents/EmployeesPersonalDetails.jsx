// src/components/EmployeeDetailsComponents/EmployeesPersonalDetails.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";


const EmployeesPersonalDetails = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();

  const defaultPersonalDetails = {
    id: "",
    employee: "",
    employee_name: "",
    father_name: "",
    mother_name: "",
    phone_number: "",
    personal_email: "",
    date_of_birth: "",
    national_id: "", 
    passport_number: "",
    blood_group: "", 
    marital_status: "",
    spouse_name: "", 
    spouse_nid: "",
    emergency_contact_name: "", 
    emergency_contact_relationship: "", 
    emergency_contact_number: "",
  };

  const [personalDetails, setPersonalDetails] = useState(defaultPersonalDetails);
  const [bloodGroupList, setBloodGroupList] = useState([]);
  const [maritalStatusList, setMaritalStatusList] = useState([]);
  const [emergencyContactRelationshipList, setEmergencyContactRelationshipList] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeePersonalDetail"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyPersonalDetail"}/`);
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
    const fetchPersonalDetails = async () => {
      try {
        let res;
        if (!rolePermissions.view) {
          return;
        }
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-personal-details/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-personal-details/');
        } else {
          return;
        }
        console.log("Employee Personal Details:", res?.data)
        setPersonalDetails(res?.data || defaultPersonalDetails); 
      } catch (error) {
        console.warn("No personal details found, showing empty form.");
        setPersonalDetails(defaultPersonalDetails);
      }
    };

    fetchPersonalDetails();
  }, [rolePermissions]);

  useEffect(() => {
    const fetchBloodGroupList = async () => {
      try {
        const res = await api.get(`system/configurations/blood-group-list/`);
        console.log("Blood Group list: ",res?.data)
        setBloodGroupList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Blood Group List");
        setBloodGroupList([]); 
      }
    };

    fetchBloodGroupList();
  }, []);

  useEffect(() => {
    const fetchMaritalStatusList = async () => {
      try {
        const res = await api.get(`system/configurations/marital-status-list/`);
        console.log("Marital Status List: ", res?.data)
        setMaritalStatusList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Marital Status List");
        setMaritalStatusList([]);
      }
    };

    fetchMaritalStatusList();
  }, []);

  useEffect(() => {
    const fetchEmergencyContactRelationshipList = async () => {
      try {
        const res = await api.get(`system/configurations/emergency-contact-relationship-list/`);
        console.log("Emergency Contact Relationship List: ", res?.data)
        setEmergencyContactRelationshipList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Emergency Contact Relationship List");
        setEmergencyContactRelationshipList([]);
      }
    };

    fetchEmergencyContactRelationshipList();
  }, []);

  const handleChange = (field, value) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };


  const validatePersonalDetails = (details) => {
    if (!details.phone_number?.trim()) {
      toast.warning("Phone number is required.");
      return false;
    }
    if (!details.personal_email?.trim()) {
      toast.warning("Personal email is required.");
      return false;
    }
    if (!details.national_id?.trim()) {
      toast.warning("National id is required.");
      return false;
    }
    
    return true;
  };


  const handleSave = async () => {
    if (!validatePersonalDetails(personalDetails)) return;
    console.log("Personal details to save:", personalDetails);
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
        if(personalDetails.id){
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/employee-personal-details/${employee_id}/`,
            personalDetails
          );
          console.log("Updateed Employee Personal Details:", res?.data);
          if(res.status === 200){
            toast.success("Personal details updated successfully!");
            setPersonalDetails(res.data || personalDetails)
          } else {
            toast.error("Failed to update personal details!")
          }
        } else {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/employee-personal-details/${employee_id}/`,
            personalDetails
          );
          console.log("Created Employee Personal Details:", res?.data);
          if(res.status === 201){
            toast.success("Personal details created successfully!");
            setPersonalDetails(res.data || personalDetails)
          } else {
            toast.error("Failed to create personal details!")
          }    
        }
      } else if(view.isOwnProfileView){
        if(personalDetails.id){
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/my-personal-details/`,
            personalDetails
          );
          console.log("Updateed Personal Details:", res?.data);
          if(res.status === 200){
            toast.success("Personal details updated successfully!");
            setPersonalDetails(res.data || personalDetails)
          } else {
            toast.error("Failed to update personal details!")
          }
        } else {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/my-personal-details/`,
            personalDetails
          );
          console.log("Created Personal Details:", res?.data);
          if(res.status === 201){
            toast.success("Personal details created successfully!");
            setPersonalDetails(res.data || personalDetails)
          } else {
            toast.error("Failed to create personal details!")
          }    
        }
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee personal details:", error?.response?.data || error);
      toast.error("Error saving personal details!");
    }
  };
  
  return (
    <div className="personal-details">
      <div className="details-card">
        {/* First Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Employee Name*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.employee_name || ""}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone Number*</label>
            <input
              type="tel"
              className="form-input"
              value={personalDetails.phone_number || ""}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>

          <div className="form-group">
            <label>National ID*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.national_id || ""}
              onChange={(e) => handleChange("national_id", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Personal Email*</label>
            <input
              type="email"
              className="form-input"
              value={personalDetails.personal_email || ""}
              onChange={(e) => handleChange("personal_email", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>

          <div className="form-group">
            <label>Father's Name</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.father_name || ""}
              onChange={(e) => handleChange("father_name", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>

          <div className="form-group">
            <label>Mother's Name</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.mother_name || ""}
              onChange={(e) => handleChange("mother_name", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              className="date-input"
              value={personalDetails.date_of_birth || ""}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>

          <div className="form-group">
            <label>Passport Number</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.passport_number || ""}
              onChange={(e) => handleChange("passport_number", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select
              className="form-select"
              value={personalDetails.blood_group || ""}
              onChange={(e) => handleChange("blood_group", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            >
              <option value="">-- Select --</option>
              {bloodGroupList.map((bloodGroup)=>(
                <option key={bloodGroup.id} value={bloodGroup.id}>{bloodGroup.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Marital Status</label>
            <select
              className="form-select"
              value={personalDetails.marital_status || ""}
              onChange={(e) => handleChange("marital_status", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            >
              <option value="">-- Select --</option>
              {maritalStatusList.map((maritalStatus)=>(
                <option key={maritalStatus.id} value={maritalStatus.id}>{maritalStatus.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Spouse Name</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.spouse_name || ""}
              onChange={(e) => handleChange("spouse_name", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>

          <div className="form-group">
            <label>Spouse NID</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.spouse_nid || ""}
              onChange={(e) => handleChange("spouse_nid", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>
        </div>

        {/* Fifth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Emergency Contact Name</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.emergency_contact_name || ""}
              onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>

          <div className="form-group">
            <label>Relationship</label>
            <select
              className="form-select"
              value={personalDetails.emergency_contact_relationship || ""}
              onChange={(e) => handleChange("emergency_contact_relationship", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            >
              <option value="">-- Select --</option>
              {emergencyContactRelationshipList.map((relationship)=>(
                <option key={relationship.id} value={relationship.id}>{relationship.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Emergency Contact Number</label>
            <input
              type="tel"
              className="form-input"
              value={personalDetails.emergency_contact_number || ""}
              onChange={(e) => handleChange("emergency_contact_number", e.target.value)}
              disabled={personalDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>
        </div>

        {/* Action Buttons - Updated for left/right positioning */}
        <div className="form-actions">
          <div className="form-actions-left">
            {(personalDetails.id ? rolePermissions.edit : rolePermissions.create) && (
              <button className="btn-success" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
          <div className="form-actions-right">
            <button className="btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn-primary" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPersonalDetails;