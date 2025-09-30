import { useState, useEffect } from "react";
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const EmployeesOfficialDetails = ({ view, employee_id, onNext }) => {
  const { user } = useAuth();
  const [toUpdate, setToUpdate] = useState(false)
  const [gradeId, setGradeId] = useState(null)

  const defaultOfficialDetails = {
    id: "",
    email: "",
    name: "",
    designation: "",
    department: "",
    joining_date: "",
    grade: "",
    reporting_manager: "",
    basic_salary: "",
    role1: "",
    role2: "",
    is_hr: false,
    reviewed_by_rm: false,
    reviewed_by_hr: false,
    reviewed_by_hod: false,
    reviewed_by_coo: false,
    reviewed_by_ceo: false,
  };

  const [officialdetails, setOfficialDetails] = useState(defaultOfficialDetails);
  const [departmentList, setDepartmentList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [reportingManagerList, setReportingManagerList] = useState([]);

  // ✅ Fetch employee details if ID exists
  useEffect(() => {
    const fetchOfficialDetails = async () => {
      try {
        let res;
        if(user?.is_hr && view.isAddNewEmployeeProfileView){
          return;
        } else if(user?.is_hr && employee_id && view.isEmployeeProfileView){
          res = await api.get(`employees/empolyee-official-details/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-official-details/');
        } else {
          return;
        }
        console.log(res?.data)
        if(res?.data?.id){
          setToUpdate(true)
        }
        setOfficialDetails(res?.data || defaultOfficialDetails); 
      } catch (error) {
        console.warn("No employee details found, showing empty form.");
        setOfficialDetails(defaultOfficialDetails);
      }
    };

    fetchOfficialDetails();
  }, [user]);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const res = await api.get(`system/departments/`);
        console.log(res.data)
        setDepartmentList(res.data || []); 
      } catch (error) {
        console.warn("Error Fetching Department List");
        setDepartmentList([]); 
      }
    };

    fetchDepartmentList();
  }, []);

  useEffect(() => {
    const fetchGradeList = async () => {
      try {
        const res = await api.get(`system/grades/`);
        console.log(res.data)
        setGradeList(res.data || []); 
      } catch (error) {
        console.warn("Error Fetching Grade List");
        setGradeList([]); 
      }
    };

    fetchGradeList();
  }, []);

  useEffect(() => {
    const fetchDesignationList = async () => {
      try {
        let res;
        if(gradeId){
          res = await api.get(`system/designations/grade/${gradeId}/`);
        } else {
          res = await api.get(`system/designations/`);
        }
        console.log(res.data)
        setDesignationList(res.data || []); 
      } catch (error) {
        console.warn("Error Fetching Designation List");
        setDesignationList([]);
      }
    };

    fetchDesignationList();
  }, [gradeId]);

  useEffect(() => {
    const fetchRoleList = async () => {
      try {
        const res = await api.get(`system/roles/`);
        console.log(res.data)
        setRoleList(res.data || []); 
      } catch (error) {
        console.warn("Error Fetching Designation List");
        setRoleList([]);
      }
    };

    fetchRoleList();
  }, []);

  useEffect(() => {
    const fetchReportingManagerList = async () => {
      try {
        const res = await api.get(`system/reporting-managers/list/`);
        console.log(res.data)
        setReportingManagerList(res.data || []); 
      } catch (error) {
        console.warn("Error Fetching Reporting Managers List");
        setReportingManagerList([]);
      }
    };

    fetchReportingManagerList();
  }, []);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    setOfficialDetails((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Save (create if new, update if existing)
  const handleSave = async () => {
    try {
      if(user?.is_hr){
        if (toUpdate) {
          // Update existing employee
          const res = await api.patch(
            `employees/empolyee-official-details/${officialdetails.id}/`,
            officialdetails
          );
          console.log("Updateed Employee:", res.data);
          if(res.data){
            alert("Employee details updated successfully!");
          } else {
            alert("Something went wrong!")
          }
        } else {
          // Create new employee
          const res = await api.post(
            `/employees/empolyee-official-details/`,
            officialdetails
          );
          console.log("New Employee:", res.data);
          if(res.data){
            alert("Employee created successfully!");
          } else {
          alert("Something went wrong!")
          }
        }
      }
    } catch (error) {
      console.error("Error saving employee:", error.response?.data || error);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="official-details">
      <div className="details-card">
        {/* First Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID*</label>
            <input
              type="text"
              className="form-input"
              value={officialdetails.id || ""}
              onChange={(e) => handleChange("id", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              className="form-input"
              value={officialdetails.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee Name*</label>
            <input
              type="text"
              className="form-input"
              value={officialdetails.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Department*</label>
            <select
              className="form-select"
              value={officialdetails.department || ""}
              onChange={(e) => handleChange("department", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            >
              <option value="">-- Select --</option>
              {departmentList.map((department)=>(
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Grade*</label>
            <select
              className="form-select"
              value={officialdetails.grade || ""}
              onChange={(e) => {
                setGradeId(parseInt(e.target.value))
                handleChange("grade", e.target.value)
              }}
              disabled={view.isOwnProfileView}
              required
            >
              <option value="">-- Select --</option>
              {gradeList.map((grade)=>(
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Joining Date*</label>
            <input
              type="date"
              className="date-input"
              value={officialdetails.joining_date || ""}
              onChange={(e) => handleChange("joining_date", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Designation*</label>
            <select
              className="form-select"
              value={officialdetails.designation || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            >
              <option value="">-- Select --</option>
              {designationList.map((designation)=>(
                <option key={designation.id} value={designation.id}>{designation.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reporting Manager*</label>
            <select
              className="form-select"
              value={officialdetails.reporting_manager || ""}
              onChange={(e) =>
                handleChange("reporting_manager", e.target.value)
              }
              disabled={view.isOwnProfileView}
              required
            >
              <option value="">-- Select --</option>
              {reportingManagerList.map((reporting_manager)=>(
                <option key={reporting_manager.id} value={reporting_manager.id}>{reporting_manager.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Basic Salary*</label>
            <input
              type="number"
              className="form-input"
              value={officialdetails.basic_salary || ""}
              onChange={(e) => handleChange("basic_salary", e.target.value)}
              disabled={view.isOwnProfileView}
              required
            />
          </div>
        </div>

         <div className="form-row">
          <div className="form-group">
            <label>Role 1*</label>
            <select
              className="form-select"
              value={officialdetails.role1 || ""}
              onChange={(e) => handleChange("role1", e.target.value)}
              disabled={view.isOwnProfileView}
            >
              <option value="">-- Select --</option>
              {roleList.map((role)=>(
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Role 2*</label>
            <select
              className="form-select"
              value={officialdetails.role2 || ""}
              onChange={(e) =>
                handleChange("role2", e.target.value)
              }
              disabled={view.isOwnProfileView}
            >
              <option value="">-- Select --</option>
              {roleList.map((role)=>(
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Is HR?*</label>
            <select
              className="form-select"
              value={officialdetails.is_hr === true ? "true" : officialdetails.is_hr === false ? "false" : ""}
              onChange={(e) => handleChange("is_hr", e.target.value === "true")}
              disabled={view.isOwnProfileView}
            >
              <option value="">-- Select --</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        {/* Review Checkboxes */}
        <div style={{ gridColumn: "1 / -1", fontFamily: "sans-serif" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            Review By
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {["rm", "hr", "hod", "coo", "ceo"].map((role) => (
              <div
                key={role}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={officialdetails[`reviewed_by_${role}`] || false}
                  onChange={(e) =>
                    handleChange(`reviewed_by_${role}`, e.target.checked)
                  }
                  disabled={view.isOwnProfileView}
                />
                <label>{role.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          {(user?.is_hr && employee_id) && (
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          )}
          <button className="btn-primary" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesOfficialDetails;
