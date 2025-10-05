// src/components/EmployeeDetailsComponents/EmployeesPersonalDetails.jsx
import { useState } from 'react';

const EmployeesPersonalDetails = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();

  const defaultPersonalDetails = {
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
  const [bloodGroupChoices, setBloodGroupChoices] = useState([]);
  const [maritalStatusChoices, setMaritalStatusChoices] = useState([]);
  const [emergencyContactRelationshipChoices, setEmergencyContactRelationshipChoices] = useState([]);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        let res;
        if(user?.is_hr && employee_id && view.isEmployeeProfileView){
          res = await api.get(`employees/employee-personal-details/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-personal-details/');
        } else {
          return;
        }
        console.log(res?.data)
        setPersonalDetails(res?.data || defaultPersonalDetails); 
      } catch (error) {
        console.warn("No employee details found, showing empty form.");
        setPersonalDetails(defaultOfficialDetails);
      }
    };

    fetchPersonalDetails();
  }, []);

  useEffect(() => {
    const fetchPersonalDetailsChoices = async () => {
      try {
        const res = await api.get(`personal-detail/choices/`);
        console.log(res?.data)
        setBloodGroupChoices(res?.data?.blood_group_choices || []); 
        setMaritalStatusChoices(res?.data?.marital_status_choices || []);
        setEmergencyContactRelationshipChoices(res?.data?.emergency_contact_relationship_choices || []);
      } catch (error) {
        console.warn("Error Fetching Choices");
        setBloodGroupChoices([]); 
        setMaritalStatusChoices([]);
        setEmergencyContactRelationshipChoices([]);
      }
    };

    fetchPersonalDetailsChoices();
  }, []);

  const handleChange = (field, value) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      let res;
      if(user?.is_hr && employee_id && view.isEmployeeProfileView){
        res = await api.put(
          `employees/employee-personal-details/${employee_id}/`,
          personalDetails
        );
        console.log("Updateed Employee Personal Details:", res.data);
        if(res.status === 200){
          alert("Employee personal details updated successfully!");
        } else {
          alert("Something went wrong!")
        }
      } else if(view.isOwnProfileView){
        res = await api.put(
          `employees/my-personal-details/`,
          personalDetails
        );
        console.log("Updateed Personal Details:", res.status);
        if(res.status === 200){
          alert("Personal details updated successfully!");
        } else {
          alert("Something went wrong!")
        }
      } else {
        alert("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee personal details:", error.response?.data || error);
      alert("Failed to save personal details.");
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
            {
              user?.is_hr ? (
                <input
                  type="tel"
                  className="form-input"
                  value={personalDetails.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  required
                />
              ) : (
                <input
                  type="tel"
                  className="form-input"
                  value={personalDetails.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  disabled={personalDetails.phone_number}
                  required
                />
              )
            }
          </div>
          <div className="form-group">
            <label>National ID*</label>
            {
              user?.is_hr ? (
                <input
                  type="text"
                  className="form-input"
                  value={personalDetails.national_id || ""}
                  onChange={(e) => handleChange("national_id", e.target.value)}
                  required
                />
              ) : (
                <input
                  type="text"
                  className="form-input"
                  value={personalDetails.national_id || ""}
                  onChange={(e) => handleChange("national_id", e.target.value)}
                  disabled={personalDetails.national_id}
                  required
                />
              )
            }
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Personal Email</label>
            <input
              type="email"
              className="form-input"
              value={personalDetails.personal_email || ""}
              onChange={(e) => handleChange("personal_email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Father's Name*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.father_name || ""}
              onChange={(e) => handleChange("father_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mother's Name*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.mother_name || ""}
              onChange={(e) => handleChange("mother_name", e.target.value)}
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth*</label>
            <input 
              type="date" 
              className="date-input"
              value={personalDetails.date_of_birth || ""}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Passport Number</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.passport_number || ""}
              onChange={(e) => handleChange("passport_number", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Blood Group*</label>
            <select
              className="form-select"
              value={personalDetails.blood_group || ""}
              onChange={(e) => handleChange("blood_group", e.target.value)}
            >
              <option value="">-- Select --</option>
              {bloodGroupChoices.map((bloodGroup)=>(
                <option key={bloodGroup.key} value={bloodGroup.key}>{bloodGroup.value}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Marital Status*</label>
            <select
              className="form-select"
              value={personalDetails.marital_status || ""}
              onChange={(e) => handleChange("marital_status", e.target.value)}
            >
              <option value="">-- Select --</option>
              {maritalStatusChoices.map((maritalStatus)=>(
                <option key={maritalStatus.key} value={maritalStatus.key}>{maritalStatus.value}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Spouse Name*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.spouse_name || ""}
              onChange={(e) => handleChange("spouse_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Spouse NID*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.spouse_nid || ""}
              onChange={(e) => handleChange("spouse_nid", e.target.value)}
            />
          </div>
        </div>

        {/* Fifth Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Emergency Contact Name*</label>
            <input
              type="text"
              className="form-input"
              value={personalDetails.emergency_contact_name || ""}
              onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Relationship*</label>
            <select
              className="form-select"
              value={personalDetails.emergency_contact_relationship || ""}
              onChange={(e) => handleChange("emergency_contact_relationship", e.target.value)}
            >
              <option value="">-- Select --</option>
              {emergencyContactRelationshipChoices.map((relationship)=>(
                <option key={relationship.key} value={relationship.key}>{relationship.value}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Emergency Contact Number*</label>
            <input
              type="tel"
              className="form-input"
              value={personalDetails.emergency_contact_number || ""}
              onChange={(e) => handleChange("emergency_contact_number", e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-primary" onClick={onNext}>
            Next
          </button>
          <button className="btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPersonalDetails;