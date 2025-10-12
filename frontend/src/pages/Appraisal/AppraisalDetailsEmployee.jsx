import React, { useState } from 'react';

// Import existing appraisal components
import EmployeeAppraisal from '../../components/AppraisalDetailsComponents/EmployeeAppraisal';
import ReportingManagerAppraisal from '../../components/AppraisalDetailsComponents/ReportingManagerAppraisal';
import HrAppraisal from '../../components/AppraisalDetailsComponents/HrAppraisal';
import HodAppraisal from '../../components/AppraisalDetailsComponents/HodAppraisal';
import CooAppraisal from '../../components/AppraisalDetailsComponents/CooAppraisal';
import CeoAppraisal from '../../components/AppraisalDetailsComponents/CeoAppraisal';


const AppraisalDetailsEmployee = () => {
  const [activeTab, setActiveTab] = useState('Employee');

  const renderActiveAppraisal = () => {
    switch (activeTab) {
      case 'Employee':
        return <EmployeeAppraisal />;
      case 'Reporting Manager':
        return <ReportingManagerAppraisal />;
      case 'Human Resource':
        return <HrAppraisal />;
      case 'Head of Department':
        return <HodAppraisal />;
      case 'Chief Operating Officer':
        return <CooAppraisal />;
      case 'Chief Executive Officer':
        return <CeoAppraisal />;
      default:
        return <EmployeeAppraisal />;
    }
  };

  const getTabButtonClass = (tabName) => {
    return `appraisal-tab-button ${activeTab === tabName ? 'active-appraisal-tab' : ''}`;
  };

  return (
    
    <div className="appraisal-page-container">
      {/* Employee Details Section */}
      <div className="employee-details-card">
        <h2 className="employee-details-title">Employee Details</h2>
        <div className="employee-details-grid">
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee ID</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Employee Name</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Designation</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Department</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Joining Date</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Grade</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Appraisal Period Start</label>
            <div className="employee-detail-value"></div>
          </div>
          <div className="employee-detail-item">
            <label className="employee-detail-label">Appraisal Period End</label>
            <div className="employee-detail-value"></div>
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

export default AppraisalDetailsEmployee;
