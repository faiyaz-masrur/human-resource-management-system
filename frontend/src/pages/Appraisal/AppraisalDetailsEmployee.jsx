import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import EmployeeAppraisal from '../../components/AppraisalDetailsComponents/EmployeeAppraisal';
import ReportingManagerAppraisal from '../../components/AppraisalDetailsComponents/ReportingManagerAppraisal';
import HrAppraisal from '../../components/AppraisalDetailsComponents/HrAppraisal';
import HodAppraisal from '../../components/AppraisalDetailsComponents/HodAppraisal';
import CooAppraisal from '../../components/AppraisalDetailsComponents/CooAppraisal';
import CeoAppraisal from '../../components/AppraisalDetailsComponents/CeoAppraisal';

const AppraisalDetailsEmployee = () => {
  const { employee_id } = useParams();
  const [activeTab, setActiveTab] = useState('Employee');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appraisal details from backend
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/appraisals/appraisal-details/${employee_id}/`);
        const data = response.data;

        // Map backend objects to frontend-friendly format
        setEmployeeDetails({
          employee_id: data.employee_id,
          employee_name: data.employee_name,
          designation: data.designation?.name || '-',
          department: data.department?.name || '-',
          joining_date: data.joining_date || '-',
          grade: data.grade?.name || '-',
          appraisal_start_date: data.appraisal_start_date || '-',
          appraisal_end_date: data.appraisal_end_date || '-',
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to load employee appraisal details:', err);
        setError('Unable to fetch details. Please try again later.');
        setLoading(false);
      }
    };

    if (employee_id) fetchDetails();
  }, [employee_id]);

  const renderActiveAppraisal = () => {
    switch (activeTab) {
      case 'Employee':
        return <EmployeeAppraisal employeeId={employee_id} />;
      case 'Reporting Manager':
        return <ReportingManagerAppraisal employeeId={employee_id} />;
      case 'Human Resource':
        return <HrAppraisal employeeId={employee_id} />;
      case 'Head of Department':
        return <HodAppraisal employeeId={employee_id} />;
      case 'Chief Operating Officer':
        return <CooAppraisal employeeId={employee_id} />;
      case 'Chief Executive Officer':
        return <CeoAppraisal employeeId={employee_id} />;
      default:
        return <EmployeeAppraisal employeeId={employee_id} />;
    }
  };

  const getTabButtonClass = (tabName) =>
    `appraisal-tab-button ${activeTab === tabName ? 'active-appraisal-tab' : ''}`;

  if (loading) return <div>Loading employee appraisal details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appraisal-page-container">
      {/* Employee Details Section */}
      <div className="employee-details-card">
        <h2 className="employee-details-title">Employee Details</h2>
        <div className="employee-details-grid">
          {Object.entries(employeeDetails).map(([key, value]) => (
            <div key={key} className="employee-detail-item">
              <label className="employee-detail-label">{key.replace(/_/g, ' ')}</label>
              <div className="employee-detail-value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Appraisal Tabs Section */}
      <div className="appraisal-tabs-container">
        <div className="appraisal-tabs-buttons">
          {[
            'Employee',
            'Reporting Manager',
            'Human Resource',
            'Head of Department',
            'Chief Operating Officer',
            'Chief Executive Officer',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={getTabButtonClass(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Render active appraisal content */}
        <div className="appraisal-content">{renderActiveAppraisal()}</div>
      </div>
    </div>
  );
};

export default AppraisalDetailsEmployee;
