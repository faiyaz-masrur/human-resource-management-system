// src/components/EmployeeDetailsComponents/EmployeesAddress.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EmployeesAddress = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const defaultAddress = {
    present_house: "",
    present_road_block_sector: "",
    present_city_village: "",
    present_police_station: "",
    present_district: "",
    present_postal_code: "",
    permanent_house: "",
    permanent_road_block_sector: "",
    permanent_city_village: "",
    permanent_police_station: "",
    permanent_district: "",
    permanent_postal_code: "",
  }

  const [addressDetails, setAddressDetails] = useState(defaultAddress);
  const [districtList, setDistrictList] = useState([]);
  const [policeStationList, setPoliceStationList] = useState([]);

  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        let res;
        if(user?.is_hr && employee_id && view.isEmployeeProfileView){
          res = await api.get(`employees/employee-address/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-address/');
        } else {
          return;
        }
        console.log(res?.data)
        setAddressDetails(res?.data || defaultAddress); 
      } catch (error) {
        console.warn("No address details found, showing empty form.");
        setAddressDetails(defaultAddress);
      }
    };

    fetchAddressDetails();
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
    setAddressDetails((prev) => ({ ...prev, [field]: value }));
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
    <div className="address-details">
      <div className="details-card">
        <h3 className="section-title">Present Address</h3>
        
        {/* Row 1: House, Apartment & Police Station */}
        <div className="form-row">
          <div className="form-group">
            <label>House, Apartment*</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.present_house || ""}
              onChange={(e) => handleChange("present_house", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Road/Block/Sector</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.present_road_block_sector || ""}
              onChange={(e) => handleChange("present_road_block_sector", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Road/Block/Sector & City/Village */}
        <div className="form-row">
          <div className="form-group">
            <label>City/Village</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.present_city_village || ""}
              onChange={(e) => handleChange("present_city_village", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <select
              className="form-select"
              value={addressDetails.present_district || ""}
              onChange={(e) => handleChange("present_district", e.target.value)}
            >
              <option value="">-- Select --</option>
              {districtList.map((district)=>(
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Police Station</label>
            <select
              className="form-select"
              value={addressDetails.present_police_station || ""}
              onChange={(e) => handleChange("present_police_station", e.target.value)}
            >
              <option value="">-- Select --</option>
              {policeStationList.map((policeStation)=>(
                <option key={policeStation.id} value={policeStation.id}>{policeStation.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="number"
              className="form-input"
              value={addressDetails.present_postal_code || ""}
              onChange={(e) => handleChange("present_postal_code", e.target.value)}
              required
            />
          </div>
        </div>

        <h3 className="section-title">Permanent Address</h3>
        
        {/* Row 1: House, Apartment & Police Station */}
        <div className="form-row">
          <div className="form-group">
            <label>House, Apartment*</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.permanent_house || ""}
              onChange={(e) => handleChange("permanent_house", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Road/Block/Sector</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.permanent_road_block_sector || ""}
              onChange={(e) => handleChange("permanent_road_block_sector", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Road/Block/Sector & City/Village */}
        <div className="form-row">
          <div className="form-group">
            <label>City/Village</label>
            <input
              type="text"
              className="form-input"
              value={addressDetails.permanent_city_village || ""}
              onChange={(e) => handleChange("permanent_city_village", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <select
              className="form-select"
              value={addressDetails.permanent_district || ""}
              onChange={(e) => handleChange("permanent_district", e.target.value)}
            >
              <option value="">-- Select --</option>
              {districtList.map((district)=>(
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Police Station</label>
            <select
              className="form-select"
              value={addressDetails.permanent_police_station || ""}
              onChange={(e) => handleChange("permanent_police_station", e.target.value)}
            >
              <option value="">-- Select --</option>
              {policeStationList.map((policeStation)=>(
                <option key={policeStation.id} value={policeStation.id}>{policeStation.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="number"
              className="form-input"
              value={addressDetails.permanent_postal_code || ""}
              onChange={(e) => handleChange("permanent_postal_code", e.target.value)}
              required
            />
          </div>
        </div>
        
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

export default EmployeesAddress;