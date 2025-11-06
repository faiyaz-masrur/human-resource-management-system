import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

// Import existing appraisal components
import EmployeeAppraisal from '../../components/AppraisalDetailsComponents/EmployeeAppraisal';
import ReportingManagerAppraisal from '../../components/AppraisalDetailsComponents/ReportingManagerAppraisal';
import HrAppraisal from '../../components/AppraisalDetailsComponents/HrAppraisal';
import HodAppraisal from '../../components/AppraisalDetailsComponents/HodAppraisal';
import CooAppraisal from '../../components/AppraisalDetailsComponents/CooAppraisal';
import CeoAppraisal from '../../components/AppraisalDetailsComponents/CeoAppraisal';

import api from '../../services/api';


const AppraisalDetails = ({ view }) => {
  const defaultAppraisalDetails = {
    emp_id: '',
    emp_name: '',
    emp_des: '',
    emp_dept: '',
    emp_join: '',
    emp_grade: '',
    appraisal_start_date: '',
    appraisal_end_date: '',
  };
  const { user } = useAuth();
  const { employee_id } = useParams();
  const [activeTab, setActiveTab] = useState('Employee');
  const [appraisalDetails, setAppraisalDetails] = useState(defaultAppraisalDetails);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view?.isMyAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"MyAppraisal"}/${"MyAppraisalDetail"}/`);
        } else if(view?.isReviewAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"ReviewAppraisal"}/${"EmployeeAppraisalDetail"}/`);
        } else if(view?.isAllAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllAppraisalDetail"}/`);
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
    const fetchAppraisalDetails = async () => {
      try {
        if (rolePermissions?.view) {
          let res;
          if(view?.isMyAppraisal){
            res = await api.get(`appraisals/my-appraisal-details/`);
          } else if(view?.isReviewAppraisal && employee_id){
            res = await api.get(`appraisals/review-appraisal-details/${employee_id}/`);
          } else if(view?.isAllAppraisal && employee_id){
            res = await api.get(`appraisals/all-appraisal-details/${employee_id}/`);
          } else {
            return; 
          }
          console.log("Appraisal Details:", res?.data);
          setAppraisalDetails(res?.data || defaultAppraisalDetails);
        }  
      } catch (error) {
        console.warn("Error fetching appraisal details:", error);
        setAppraisalDetails(defaultAppraisalDetails);
      }
    };

    fetchAppraisalDetails();
  }, [rolePermissions]);


  const renderActiveAppraisal = () => {
    switch (activeTab) {
      case 'Employee':
        return <EmployeeAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      case 'Reporting Manager':
        return <ReportingManagerAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      case 'Human Resource':
        return <HrAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      case 'Head of Department':
        return <HodAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      case 'Chief Operating Officer':
        return <CooAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      case 'Chief Executive Officer':
        return <CeoAppraisal view={view} appraisalDetails={appraisalDetails}/>;
      default:
        return <EmployeeAppraisal view={view} appraisalDetails={appraisalDetails}/>;
    }
  };

  const getTabButtonClass = (tabName) => {
    return `appraisal-tab-button ${activeTab === tabName ? 'active-appraisal-tab' : ''}`;
  };


  const handleChange = (field, value) => {
    setAppraisalDetails((prev) => ({ ...prev, [field]: value }));
  };


  const handleSetPeriod = async () => {
    try {
      if (!rolePermissions.edit) {
        toast.warning("You don't have permission to edit.");
        return;
      }
      let res;
      if (view?.isMyAppraisal) {
        res = await api.patch(`appraisals/my-appraisal-details/`, {
          appraisal_start_date: appraisalDetails?.appraisal_start_date,
          appraisal_end_date: appraisalDetails?.appraisal_end_date,
        });
      } else if (view?.isReviewAppraisal && employee_id) {
        res = await api.patch(`appraisals/review-appraisal-details/${employee_id}/`, {
          appraisal_start_date: appraisalDetails?.appraisal_start_date,
          appraisal_end_date: appraisalDetails?.appraisal_end_date,
        });
      } else if (view?.isAllAppraisal && employee_id) {
        res = await api.post(`appraisals/all-appraisal-details/${employee_id}/`, {
          appraisal_start_date: appraisalDetails?.appraisal_start_date,
          appraisal_end_date: appraisalDetails?.appraisal_end_date,
        });
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
      console.log("Set Period Response:", res?.data);
      if(res.status === 200){
        toast.success("Appraisal period set successfully.");
      } else {
        toast.error("Failed to set appraisal period.");
      }
    } catch (error) {
      console.warn("Error setting appraisal period:", error);
      toast.error("An error occurred while setting the appraisal period.");
    } 
  };



  return (
    
    <div className="appraisal-page-container">
      {/* Employee Details Section */}
      <div className="employee-details-card">
        <h2 className="employee-details-title">Employee Details</h2>
        <div className="employee-details-grid">
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee ID</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_id}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee Name</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_name}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Designation</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_des}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Department</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_dept}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Joining Date</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_join}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Grade</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_grade}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Appraisal Period Start</label>
            <input
              type="date"
              className="employee-detail-value"
              value={appraisalDetails?.appraisal_start_date || ''}
              onChange={(e) => handleChange("appraisal_start_date", e.target.value)}
              disabled={!rolePermissions.edit}
              required
            />
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Appraisal Period End</label>
            <input
              type="date"
              className="employee-detail-value"
              value={appraisalDetails?.appraisal_end_date || ''}
              onChange={(e) => handleChange("appraisal_end_date", e.target.value)}
              disabled={!rolePermissions.edit}
              required
            />
          </div>
          <div>
            {
              rolePermissions.edit && (
                <button className='' onClick={handleSetPeriod}>
                  Set Period
                </button>
              )
            }
          </div>
        </div>
      </div>

      {/* Appraisal Tabs Section */}
      <div className="appraisal-tabs-container">
        <div className="appraisal-tabs-buttons">
          <button onClick={() => setActiveTab('Employee')} className={getTabButtonClass('Employee')}>
            Employee
          </button>
          <button onClick={() => setActiveTab('Reporting Manager')} className={getTabButtonClass('Reporting Manager')}>
            Reporting Manager
          </button>
          <button onClick={() => setActiveTab('Human Resource')} className={getTabButtonClass('Human Resource')}>
            Human Resource
          </button>
          <button onClick={() => setActiveTab('Head of Department')} className={getTabButtonClass('Head of Department')}>
            Head of Department
          </button>
          <button onClick={() => setActiveTab('Chief Operating Officer')} className={getTabButtonClass('Chief Operating Officer')}>
            Chief Operating Officer
          </button>
          <button onClick={() => setActiveTab('Chief Executive Officer')} className={getTabButtonClass('Chief Executive Officer')}>
            Chief Executive Officer
          </button>
        </div>

        {/* Render active appraisal content */}
        <div className="appraisal-content">{renderActiveAppraisal()}</div>
      </div>
    </div>
  );
};

export default AppraisalDetails;
