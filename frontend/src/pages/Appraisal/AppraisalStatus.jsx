import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

import api from "../../services/api";


const AppraisalStatus = () => {
  const { user } = useAuth();
  const [appraisalStatusList, setAppraisalStatusList] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
      const fetchRolePermissions = async () => {
          try {
              const res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AppraisalStatus"}/`);
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
      const fetchAppraisalStatusList= async () => {
          try {
              if (rolePermissions?.view) {
                  const res = await api.get(`appraisals/appraisal-status-list/`);
                  console.log("Appraisal Status List:", res?.data);
                  setAppraisalStatusList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : [])
              }  
          } catch (error) {
              console.warn("Error fetching appraisal status List:", error);
              setAppraisalStatusList([]);
          }
      };

      fetchAppraisalStatusList();
  }, [rolePermissions]);


  return (
    <div className="appraisal-status-container">
      <h2 className="page-title">Employee Appraisal Status</h2>

      <div className="status-table-wrapper">
        <table className="appraisal-status-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>DATE</th>
              <th>Self</th>
              <th>RM</th>
              <th>HR</th>
              <th>HOD</th>
              <th>COO</th>
              <th>CEO</th>
            </tr>
          </thead>
          <tbody>
            {appraisalStatusList.map((status) => (
              <tr key={status.emp_id}>
                <td>{status.emp_id}</td>
                <td>{status.emp_name}</td>
                <td>{status.appraisal_date}</td>
                <td>{status.self_appraisal_done}</td>
                <td>{status.rm_review_done}</td>
                <td>{status.hr_review_done}</td>
                <td>{status.hod_review_done}</td>
                <td>{status.coo_review_done}</td>
                <td>{status.ceo_review_done}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppraisalStatus;