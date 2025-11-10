import { useState, useEffect } from "react";
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeesOfficialDetails = ({ view, employee_id, set_employee_id, onNext }) => {
  const { user } = useAuth();
  const [gradeId, setGradeId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

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
    role: "",
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
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeOfficialDetail"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyOfficialDetail"}/`);
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
    const fetchOfficialDetails = async () => {
      try {
        if (!rolePermissions.view) {
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/empolyee-official-details/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-official-details/');
        } else {
          return;
        }
        console.log("Employee official details:", res?.data)
        if(res?.data?.id){
          setIsEditing(true);
        }
        setOfficialDetails(res?.data || defaultOfficialDetails); 
      } catch (error) {
        console.warn("No employee details found, showing empty form.", error);
        setOfficialDetails(defaultOfficialDetails);
      }
    };

    fetchOfficialDetails();
  }, [rolePermissions, employee_id]);


  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const res = await api.get(`system/configurations/departments/`);
        console.log("Department list:", res.data)
        setDepartmentList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Department List", error);
        setDepartmentList([]); 
      }
    };

    fetchDepartmentList();
  }, []);


  useEffect(() => {
    const fetchGradeList = async () => {
      try {
        const res = await api.get(`system/configurations/grades/`);
        console.log("Grade list:", res.data)
        setGradeList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Grade List", error);
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
          res = await api.get(`system/configurations/grade-specific-designations/${gradeId}/`);
        } else {
          res = await api.get(`system/configurations/designations/`);
        }
        console.log("Designation list:", res.data)
        setDesignationList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Designation List", error);
        setDesignationList([]);
      }
    };

    fetchDesignationList();
  }, [gradeId]);


  useEffect(() => {
    const fetchRoleList = async () => {
      try {
        const res = await api.get(`system/configurations/roles/`);
        console.log("Role list:", res.data)
        setRoleList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Designation List", error);
        setRoleList([]);
      }
    };

    fetchRoleList();
  }, []);


  useEffect(() => {
    const fetchReportingManagerList = async () => {
      try {
        const res = await api.get(`system/configurations/reporting-managers-list/`);
        console.log("Reporting manager list:", res.data)
        setReportingManagerList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []); 
      } catch (error) {
        console.warn("Error Fetching Reporting Managers List", error);
        setReportingManagerList([]);
      }
    };

    fetchReportingManagerList();
  }, []);


  const handleChange = (field, value) => {
    setOfficialDetails((prev) => ({ ...prev, [field]: value }));
  };


  const validateOfficialDetails = (details) => {
    const companyEmailPattern = /^[a-zA-Z0-9._%+-]+@sonaliintellect\.com$/;
    if (!details.id?.trim()) {
      toast.warning("Employee ID is required.");
      return false;
    }
    if (!details.email?.trim()) {
      toast.warning("Email is required.");
      return false;
    }
    if (!companyEmailPattern.test(details.email)) {
      toast.warning("Please use a valid Sonali Intellect email (example@sonaliintellect.com).");
      return;
    }
    if (!details.name?.trim()) {
      toast.warning("Name is required.");
      return false;
    }
    if (!details.department) {
      toast.warning("Department is required.");
      return false;
    }
    if (!details.grade) {
      toast.warning("Grade is required.");
      return false;
    }
    if (!details.joining_date) {
      toast.warning("Joining Date is required.");
      return false;
    }
    if (!details.designation) {
      toast.warning("Designation is required.");
      return false;
    }
    if (!details.basic_salary) {
      toast.warning("Basic Salary is required.");
      return false;
    }
    if (!details.role) {
      toast.warning("Role is required.");
      return false;
    }
    
    return true;
  };


  // ✅ Save (create if new, update if existing)
  const handleSave = async () => {
    try {
      if (!validateOfficialDetails(officialdetails)) return;
      console.log("Official Details to save:", officialdetails);
      if(view.isEmployeeProfileView || view.isAddNewEmployeeProfileView){
        if (isEditing) {
          // Update existing employee
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/empolyee-official-details/${officialdetails.id}/`,
            officialdetails
          );
          console.log("Updateed Employee:", res.status);
          if(res.status === 200){
            toast.success('Official details updated successfully!');
            setOfficialDetails(res?.data || officialdetails)
          } else {
            toast.error('Failed to update official details!')
          }
        } else {
          // Create new employee
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `/employees/empolyee-official-details/`,
            officialdetails
          );
          console.log("New Employee:", res.status);
          if(res.status === 201){
            toast.success('Official details created successfully!');
            setOfficialDetails(res?.data || officialdetails);
            set_employee_id(res.data.id);
            setIsEditing(true);
          } else {
            toast.error('Failed to create official details!');
          }
        }
      } else if(view.isOwnProfileView){ 
        if (isEditing) {
          // Update existing employee
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/my-official-details/`,
            officialdetails
          );
          console.log("Updateed Official Details:", res.status);
          if(res.status === 200){
            toast.success('Official details updated successfully!');
            setOfficialDetails(res?.data || officialdetails)
          } else {
            toast.error('Failed to updated official details!')
          }
        } 
      } else {
        toast.error("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee:", error.response?.data || error);

      if (error.response && error.response.status === 400) {
        const errors = error.response.data;

        // If there are field errors (e.g., email, name, etc.)
        if (typeof errors === "object") {
          let messages = [];
          for (const field in errors) {
            if (Array.isArray(errors[field])) {
              messages.push(`${field}: ${errors[field][0]}`);
            } else {
              messages.push(`${field}: ${errors[field]}`);
            }
          }

          // Show all validation messages together
          toast.error(`Validation error:\n\n${messages.join("\n")}`);
        } else {
          toast.error("Validation failed. Please check your input.");
        }
      } else {
        toast.error("Error saving official details!");
      }
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
              disabled={isEditing ? true : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
              required
            >
              <option value="">-- Select --</option>
              {reportingManagerList.map((reporting_manager)=>(
                <option key={reporting_manager.manager} value={reporting_manager.manager}>{reporting_manager.name}</option>
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
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>
        </div>

         <div className="form-row">
          <div className="form-group">
            <label>Role*</label>
            <select
              className="form-select"
              value={officialdetails.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
            >
              <option value="">-- Select --</option>
              {roleList.map((role)=>(
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
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
                style={{ display: "flex", alignItems: "center", gap: "8px", }}
              >
                <input
                  type="checkbox"
                  checked={officialdetails[`reviewed_by_${role}`] || false}
                  onChange={(e) =>
                    handleChange(`reviewed_by_${role}`, e.target.checked)
                  }
                  disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
                />
                <label>{role.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* to keep Save on left and Next on right */}
        <div className="form-actions">
          <div className="form-actions-left">
            {(isEditing ? rolePermissions.edit : rolePermissions.create) && (
              <button className="btn-success" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
          <div className="form-actions-right">
            <button className="btn-primary" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesOfficialDetails;