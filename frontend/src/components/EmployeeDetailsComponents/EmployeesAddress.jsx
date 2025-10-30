// src/components/EmployeeDetailsComponents/EmployeesAddress.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

const EmployeesAddress = ({ view, employee_id, onNext, onBack }) => {
  const { user } = useAuth();
  const defaultAddress = {
    id: "",
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
  const [districtListPresent, setDistrictListPresent] = useState([]);
  const [districtListParmanent, setDistrictListParmanent] = useState([]);
  const [districtIdPresent, setDistrictIdPresent] = useState(null);
  const [districtIdParmanent, setDistrictIdParmanent] = useState(null);
  const [policeStationListPresent, setPoliceStationListPresent] = useState([]);
  const [policeStationListParmanent, setPoliceStationListParmanent] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeAddress"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyAddress"}/`);
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
    const fetchAddressDetails = async () => {
      try {
        if (!rolePermissions.view) {
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-address/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-address/');
        } else {
          return;
        }
        setAddressDetails(res?.data || defaultAddress); 
      } catch (error) {
        console.warn("No address details found, showing empty form.");
        setAddressDetails(defaultAddress);
      }
    };

    fetchAddressDetails();
  }, [rolePermissions]);

  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        const res = await api.get(`system/configurations/bd-district-list/`);
        setDistrictListPresent(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
        setDistrictListParmanent(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching District List", error);
        setDistrictListPresent([]);
        setDistrictListParmanent([]);
      }
    };

    fetchDistrictList();
  }, []);

  useEffect(() => {
    const fetchPoliceStationListPresent = async () => {
      try {
        let res;
        if (districtIdPresent){
          res = await api.get(`system/configurations/bd-thana-list/${districtIdPresent}`);
        } else {
          res = await api.get(`system/configurations/bd-thana-list/`);
        }
        setPoliceStationListPresent(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Thana List Present", error);
        setPoliceStationListPresent([]);
      }
    };

    fetchPoliceStationListPresent();
  }, [districtIdPresent]);

  useEffect(() => {
    const fetchPoliceStationListParmanent = async () => {
      try {
        let res;
        if (districtIdParmanent){
          res = await api.get(`system/configurations/bd-thana-list/${districtIdParmanent}`);
        } else {
          res = await api.get(`system/configurations/bd-thana-list/`);
        }
        setPoliceStationListParmanent(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (error) {
        console.warn("Error Fetching Thana List Parmanent", error);
        setPoliceStationListParmanent([]);
      }
    };

    fetchPoliceStationListParmanent();
  }, [districtIdParmanent]);

  const handleChange = (field, value) => {
    setAddressDetails((prev) => ({ ...prev, [field]: value }));
  };


  const validateAddress = (address) => {
    if (!address.present_house?.trim()) {
      toast.warning("Present House is required.");
      return false;
    }
    if (!address.present_city_village?.trim()) {
      toast.warning("Present City/Village is required.");
      return false;
    }
    if (!address.present_district) {
      toast.warning("Present District is required.");
      return false;
    }
    if (!address.present_police_station) {
      toast.warning("Present Police Station is required.");
      return false;
    }
    if (!address.present_postal_code?.trim()) {
      toast.warning("Present Postal Code is required.");
      return false;
    }
    if (!address.permanent_house?.trim()) {
      toast.warning("Permanent House is required.");
      return false;
    }
    if (!address.permanent_city_village?.trim()) {
      toast.warning("Permanent City/Village is required.");
      return false;
    }
    if (!address.permanent_district) {
      toast.warning("Permanent District is required.");
      return false;
    }
    if (!address.permanent_police_station) {
      toast.warning("Permanent Police Station is required.");
      return false;
    }
    if (!address.permanent_postal_code?.trim()) {
      toast.warning("Permanent Postal Code is required.");
      return false;
    }
    
    return true;
  };


  const handleSave = async () => {
    if (!validateAddress(addressDetails)) return;
    console.log("Address to save:", addressDetails);
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
        if(!addressDetails.id){
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-address/${employee_id}/`, addressDetails);
          if(res.status === 201){
            toast.success("Address created successfully!");
            setAddressDetails(res?.data || addressDetails);
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-address/${employee_id}/`, addressDetails);
          if(res.status === 200){
            toast.success("Address updated successfully!");
            setAddressDetails(res?.data || addressDetails);
          }
        }
      } else if(view.isOwnProfileView){
        if(!addressDetails.id){
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-address/`, addressDetails);
          if(res.status === 201){
            toast.success("Address created successfully!");
            setAddressDetails(res?.data || addressDetails);
          }
        } else {
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-address/`, addressDetails);
          if(res.status === 200){
            toast.success("Address updated successfully!");
            setAddressDetails(res?.data || addressDetails);
          }
        }
      } else {
        alert("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee address details:", error);
      alert("Failed to save address details.");
    }
  };

  return (
    <div className="address-container">
      <div className="address-content">
        {/* Present Address Section */}
        <div className="address-section">
          <div className="section-header">Present Address</div>
          
          <div className="address-grid">
            {/* House, Apartment */}
            <div className="input-group">
              <label>House, Apartment*</label>
              <input
                type="text"
                placeholder="Enter details"
                value={addressDetails.present_house || ""}
                onChange={(e) => handleChange("present_house", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* Road/Block/Sector */}
            <div className="input-group">
              <label>Road/Block/Sector</label>
              <input
                type="text"
                placeholder="2"
                value={addressDetails.present_road_block_sector || ""}
                onChange={(e) => handleChange("present_road_block_sector", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* City/Village */}
            <div className="input-group">
              <label>City/Village</label>
              <input
                type="text"
                placeholder="Pallabi"
                value={addressDetails.present_city_village || ""}
                onChange={(e) => handleChange("present_city_village", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* Police Station */}
            <div className="input-group">
              <label>Police Station</label>
              <select
                value={addressDetails.present_police_station || ""}
                onChange={(e) => handleChange("present_police_station", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              >
                <option value="">Pallabi</option>
                {policeStationListPresent.map((policeStation) => (
                  <option key={policeStation.id} value={policeStation.id}>{policeStation.name}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="input-group">
              <label>District</label>
              <select
                value={addressDetails.present_district || ""}
                onChange={(e) => {
                  setDistrictIdPresent(parseInt(e.target.value))
                  handleChange("present_district", e.target.value)
                }}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              >
                <option value="">Dhaka</option>
                {districtListPresent.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div className="input-group">
              <label>Postal Code</label>
              <input
                type="number"
                placeholder="1216"
                value={addressDetails.present_postal_code || ""}
                onChange={(e) => handleChange("present_postal_code", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="address-section">
          <div className="section-header">Permanent Address</div>
          
          <div className="address-grid">
            {/* House, Apartment */}
            <div className="input-group">
              <label>House, Apartment*</label>
              <input
                type="text"
                placeholder="Enter details"
                value={addressDetails.permanent_house || ""}
                onChange={(e) => handleChange("permanent_house", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* Road/Block/Sector */}
            <div className="input-group">
              <label>Road/Block/Sector</label>
              <input
                type="text"
                placeholder="2"
                value={addressDetails.permanent_road_block_sector || ""}
                onChange={(e) => handleChange("permanent_road_block_sector", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* City/Village */}
            <div className="input-group">
              <label>City/Village</label>
              <input
                type="text"
                placeholder="Pallabi"
                value={addressDetails.permanent_city_village || ""}
                onChange={(e) => handleChange("permanent_city_village", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>

            {/* Police Station */}
            <div className="input-group">
              <label>Police Station</label>
              <select
                value={addressDetails.permanent_police_station || ""}
                onChange={(e) => handleChange("permanent_police_station", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              >
                <option value="">Pallabi</option>
                {policeStationListParmanent.map((policeStation) => (
                  <option key={policeStation.id} value={policeStation.id}>{policeStation.name}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="input-group">
              <label>District</label>
              <select
                value={addressDetails.permanent_district || ""}
                onChange={(e) => {
                  setDistrictIdParmanent(parseInt(e.target.value))
                  handleChange("permanent_district", e.target.value)
                }}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              >
                <option value="">Dhaka</option>
                {districtListParmanent.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div className="input-group">
              <label>Postal Code</label>
              <input
                type="number"
                placeholder="1216"
                value={addressDetails.permanent_postal_code || ""}
                onChange={(e) => handleChange("permanent_postal_code", e.target.value)}
                disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {(addressDetails.id ? rolePermissions.edit : rolePermissions.create) && (
          <div className="save-container">
            <button className="save-btn" onClick={handleSave}>
              Save
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

export default EmployeesAddress;