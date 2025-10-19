// src/components/EmployeeDetailsComponents/EmployeesAddress.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
        console.log("Employee address details:", res?.data)
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
        console.log("District list:", res?.data)
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
        console.log("Police station list Present:", res?.data)
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
        console.log("Police station list Parmanent:", res?.data)
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

  const handleSave = async () => {
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
        if(!addressDetails.id){
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/employee-address/${employee_id}/`, addressDetails);
          console.log("Created Employee Address:", res.data);
          if(res.status === 201){
            alert("Employee address created successfully!");
            setAddressDetails(res?.data || addressDetails);
          } else {
            alert("Something went wrong!")
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/employee-address/${employee_id}/`, addressDetails);
          console.log("Updated Employee Address:", res.status);
          if(res.status === 200){
            alert("Employee address updated successfully!");
            setAddressDetails(res?.data || addressDetails);
          } else {
            alert("Something went wrong!")
          }
        }
      } else if(view.isOwnProfileView){
        if(!addressDetails.id){
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(`employees/my-address/`, addressDetails);
          console.log("Created My Address:", res.data);
          if(res.status === 201){
            alert("Your address created successfully!");
            setAddressDetails(res?.data || addressDetails);
          } else {
            alert("Something went wrong!")
          }
        } else {
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(`employees/my-address/`, addressDetails);
          console.log("Updated My Address:", res.status);
          if(res.status === 200){
            alert("Your address updated successfully!");
            setAddressDetails(res?.data || addressDetails);
          } else {
            alert("Something went wrong!")
          }
        }
      } else {
        alert("You don't have permission to perform this action. First save employee official details.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee address details:", error.response?.data || error);
      alert("Failed to save address details.");
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>
          <div className="form-group">
            <label>District*</label>
            <select
              className="form-select"
              value={addressDetails.present_district || ""}
              onChange={(e) => {
                setDistrictIdPresent(parseInt(e.target.value))
                handleChange("present_district", e.target.value)}
              }
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            >
              <option value="">-- Select --</option>
              {districtListPresent.map((district)=>(
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Police Station*</label>
            <select
              className="form-select"
              value={addressDetails.present_police_station || ""}
              onChange={(e) => handleChange("present_police_station", e.target.value)}
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            >
              <option value="">-- Select --</option>
              {policeStationListPresent.map((policeStation)=>(
                <option key={policeStation.id} value={policeStation.id}>{policeStation.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code*</label>
            <input
              type="number"
              className="form-input"
              value={addressDetails.present_postal_code || ""}
              onChange={(e) => handleChange("present_postal_code", e.target.value)}
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
            />
          </div>
          <div className="form-group">
            <label>District*</label>
            <select
              className="form-select"
              value={addressDetails.permanent_district || ""}
              onChange={(e) => {
                setDistrictIdParmanent(parseInt(e.target.value))
                handleChange("permanent_district", e.target.value)
              }}
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            >
              <option value="">-- Select --</option>
              {districtListParmanent.map((district)=>(
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: District & Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Police Station*</label>
            <select
              className="form-select"
              value={addressDetails.permanent_police_station || ""}
              onChange={(e) => handleChange("permanent_police_station", e.target.value)}
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            >
              <option value="">-- Select --</option>
              {policeStationListParmanent.map((policeStation)=>(
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
              disabled={addressDetails.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          {(addressDetails.id ? rolePermissions.edit : rolePermissions.create) && (
            <button className="btn-success" onClick={handleSave}>
              Save
            </button>
          )}
          <button className="btn-primary" onClick={onNext}>
            Next
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