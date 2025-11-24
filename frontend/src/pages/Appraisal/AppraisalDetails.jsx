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
import { generateAppraisalPDF } from '../../utils/pdfGenerator';

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
  const [appraisalStatus, setAppraisalStatus] = useState({});
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [settingPeriod, setSettingPeriod] = useState(false);

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
        console.warn("Error fetching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, [user.role, view]);

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      try {
        if (rolePermissions?.view) {
          setLoading(true);
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
        if (error.response?.status === 404) {
          // This is normal for new users - they don't have appraisal details yet
          console.log("No appraisal details found - this is normal for new users");
          setAppraisalDetails(defaultAppraisalDetails);
        } else {
          toast.error("Failed to load appraisal details");
          setAppraisalDetails(defaultAppraisalDetails);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppraisalDetails();
  }, [rolePermissions, view, employee_id]);

  useEffect(() => {
    const fetchAppraisalStatus = async () => {
      try {
        if (rolePermissions?.view && appraisalDetails?.appraisal_status) {
          const res = await api.get(`appraisals/appraisal-status/${appraisalDetails.appraisal_status}`)
          console.log("Appraisal Status:", res?.data);
          setAppraisalStatus(res?.data || {});
        }  
      } catch (error) {
        console.warn("Error fetching appraisal status:", error);
        setAppraisalStatus({});
      }
    };

    fetchAppraisalStatus();
  }, [rolePermissions, appraisalDetails]);

  // PDF Download Function with Improved Error Handling
  const downloadAppraisalPDF = async () => {
    try {
      toast.info("Generating PDF...");
      
      let completeAppraisalData;
      let response;
      
      if (view?.isMyAppraisal) {
        response = await api.get(`appraisals/my-full-appraisal-data/`);
        completeAppraisalData = response.data;
      } else if (view?.isReviewAppraisal && employee_id) {
        response = await api.get(`appraisals/review-full-appraisal-data/${employee_id}/`);
        completeAppraisalData = response.data;
      } else if (view?.isAllAppraisal && employee_id) {
        response = await api.get(`appraisals/all-full-appraisal-data/${employee_id}/`);
        completeAppraisalData = response.data;
      } else {
        toast.error("Unable to fetch appraisal data.");
        return;
      }

      console.log("Complete Appraisal Data:", completeAppraisalData);

      // Check if we got an error response from backend
      if (completeAppraisalData.error) {
        toast.error(completeAppraisalData.message || completeAppraisalData.error);
        return;
      }

      // Check if we have any data to generate PDF
      const hasData = completeAppraisalData.employee || 
                     completeAppraisalData.reportingManager || 
                     completeAppraisalData.hr || 
                     completeAppraisalData.hod || 
                     completeAppraisalData.coo || 
                     completeAppraisalData.ceo;

      if (!hasData) {
        toast.warning("No appraisal data available to generate PDF.");
        return;
      }

      // Generate PDF using the new function
      await generateAppraisalPDF(completeAppraisalData, appraisalDetails);
      
      toast.success("Appraisal PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading appraisal PDF:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle different types of errors
      if (error.response?.status === 404) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Appraisal data not found. Please contact HR.");
        }
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to download this appraisal.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to download appraisal PDF. Please try again.");
      }
    }
  };

  const handleChange = (field, value) => {
    setAppraisalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetPeriod = async () => {
    // Validation
    if (!appraisalDetails?.appraisal_start_date || !appraisalDetails?.appraisal_end_date) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(appraisalDetails.appraisal_start_date) >= new Date(appraisalDetails.appraisal_end_date)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      if (!rolePermissions.edit) {
        toast.warning("You don't have permission to edit.");
        return;
      }
      
      setSettingPeriod(true);
      toast.info("Setting appraisal period...");
      
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
        res = await api.patch(`appraisals/all-appraisal-details/${employee_id}/`, {
          appraisal_start_date: appraisalDetails?.appraisal_start_date,
          appraisal_end_date: appraisalDetails?.appraisal_end_date,
        });
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
      
      console.log("Set Period Response:", res?.data);
      if(res.status === 200){
        setAppraisalDetails(res?.data || appraisalDetails)
        toast.success("Appraisal period set successfully.");
      } else {
        toast.error("Failed to set appraisal period.");
      }
    } catch (error) {
      console.warn("Error setting appraisal period:", error);
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        toast.error("Server error. Please try again or contact support.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid data. Please check the dates and try again.");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred while setting the appraisal period.");
      }
    } finally {
      setSettingPeriod(false);
    }
  };

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

  if (loading) {
    return (
      <div className="appraisal-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appraisal details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appraisal-page-container">
      {/* Employee Details Section */}
      <div className="employee-details-card">
        <h2 className="employee-details-title">Employee Details</h2>
        <div className="employee-details-grid">
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee ID</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_id || 'N/A'}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee Name</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_name || 'N/A'}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Designation</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_des || 'N/A'}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Department</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_dept || 'N/A'}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Joining Date</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_join || 'N/A'}</div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Grade</label>
            <div className="employee-detail-value">{appraisalDetails?.emp_grade || 'N/A'}</div>
          </div>

          {/* Compact Row - All in one line */}
          <div className="employee-detail-item compact-row">
            <div className="compact-period-group">
              <div className="compact-period-item">
                <label className="employee-detail-label">Appraisal Period Start</label>
                <input
                  type="date"
                  className="compact-date-input"
                  value={appraisalDetails?.appraisal_start_date || ''}
                  onChange={(e) => handleChange("appraisal_start_date", e.target.value)}
                  disabled={!rolePermissions.edit}
                  required
                />
              </div>
              <div className="compact-period-item">
                <label className="employee-detail-label">Appraisal Period End</label>
                <input
                  type="date"
                  className="compact-date-input"
                  value={appraisalDetails?.appraisal_end_date || ''}
                  onChange={(e) => handleChange("appraisal_end_date", e.target.value)}
                  disabled={!rolePermissions.edit}
                  required
                />
              </div>
            </div>
            
            <div className="compact-download-item">
              <label className="employee-detail-label">Download Report</label>
              <button 
                className="compact-download-btn"
                onClick={downloadAppraisalPDF}
                disabled={!rolePermissions?.view}
                title="Download Complete Appraisal as PDF"
              >
                📄 Download PDF
              </button>
            </div>

            <div className="compact-warning-item">
              <label className="compact-warning-text"> 
                PLEASE SUBMIT CAREFULLY. YOU WILL NOT BE ABLE TO MAKE ANY CHANGES AFTER SUBMISSION. 
              </label>
            </div>
          </div>

          {/* Set Period Button */}
          <div className="employee-detail-item">
            <div className="set-period-container">
              {rolePermissions.edit && (
                <button 
                  className={`employee-detail-value-button ${settingPeriod ? 'loading' : ''}`}
                  onClick={handleSetPeriod}
                  disabled={settingPeriod || !appraisalDetails?.appraisal_start_date || !appraisalDetails?.appraisal_end_date}
                >
                  {settingPeriod ? 'Setting Period...' : 'Set Period'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appraisal Tabs Section */}
      <div className="appraisal-tabs-container">
        <div className="appraisal-tabs-buttons">
          <button onClick={() => setActiveTab('Employee')} className={getTabButtonClass('Employee')}>
            Employee
          </button>
          {!(appraisalStatus?.rm_review_done === 'NA') && (
            <button onClick={() => setActiveTab('Reporting Manager')} className={getTabButtonClass('Reporting Manager')}>
              Reporting Manager
            </button>
          )}
          {!(appraisalStatus?.hr_review_done === 'NA') && (
            <button onClick={() => setActiveTab('Human Resource')} className={getTabButtonClass('Human Resource')}>
              Human Resource
            </button>
          )}
          {!(appraisalStatus?.hod_review_done === 'NA') && (
            <button onClick={() => setActiveTab('Head of Department')} className={getTabButtonClass('Head of Department')}>
              Head of Department
            </button>
          )}
          {!(appraisalStatus?.coo_review_done === 'NA') && (
            <button onClick={() => setActiveTab('Chief Operating Officer')} className={getTabButtonClass('Chief Operating Officer')}>
              Chief Operating Officer
            </button>
          )}
          {!(appraisalStatus?.ceo_review_done === 'NA') && (
            <button onClick={() => setActiveTab('Chief Executive Officer')} className={getTabButtonClass('Chief Executive Officer')}>
              Chief Executive Officer
            </button>
          )}
        </div>

        {/* Render active appraisal content */}
        <div className="appraisal-content">
          {renderActiveAppraisal()}
        </div>
      </div>
    </div>
  );
};

export default AppraisalDetails;