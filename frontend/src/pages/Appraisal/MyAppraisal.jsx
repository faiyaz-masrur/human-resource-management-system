import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import EmployeeAppraisal from '../../components/AppraisalDetailsComponents/EmployeeAppraisal';
import ReportingManagerAppraisal from '../../components/AppraisalDetailsComponents/ReportingManagerAppraisal';
import HrAppraisal from '../../components/AppraisalDetailsComponents/HrAppraisal';
import HodAppraisal from '../../components/AppraisalDetailsComponents/HodAppraisal';
import CooAppraisal from '../../components/AppraisalDetailsComponents/CooAppraisal';
import CeoAppraisal from '../../components/AppraisalDetailsComponents/CeoAppraisal';

const MyAppraisal = () => {
  const { employee_id } = useParams(); 
  const [activeTab, setActiveTab] = useState('My Appraisal');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyAppraisal = async () => {
      try {
        const response = await api.get(`/appraisals/appraisal-details/`);
        const data = response.data;

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
        console.error('Failed to load self-appraisal:', err);
        setError('Unable to fetch appraisal details.');
        setLoading(false);
      }
    };

     fetchMyAppraisal();
  }, []);

  const renderActiveAppraisal = () => {
    switch (activeTab) {
      case 'My Appraisal':
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

  if (loading) return <div>Loading appraisal details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appraisal-page-container">

      <div className="employee-details-card">
        <h2 className="employee-details-title">My Appraisal</h2>
        <div className="employee-details-grid">
          {[
            ['Employee ID', 'employee_id'],
            ['Employee Name', 'employee_name'],
            ['Designation', 'designation'],
            ['Department', 'department'],
            ['Joining Date', 'joining_date'],
            ['Grade', 'grade'],
            ['Appraisal Period Start', 'appraisal_start_date'],
            ['Appraisal Period End', 'appraisal_end_date'],
          ].map(([label, key]) => (
            <div className="employee-detail-item" key={key}>
              <label className="employee-detail-label">{label}</label>
              <div className="employee-detail-value">{employeeDetails?.[key] || '-'}</div>
            </div>
          ))}
        </div>
      </div>


      <div className="appraisal-tabs-container">
        <div className="appraisal-tabs-buttons">
          {[
            'My Appraisal',
            'Reporting Manager',
            'Human Resource',
            'Head of Department',
            'Chief Operating Officer',
            'Chief Executive Officer',
          ].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={getTabButtonClass(tab)}>
              {tab}
            </button>
          ))}
        </div>

        <div className="appraisal-content">{renderActiveAppraisal()}</div>
      </div>
    </div>
  );
};

export default MyAppraisal;
