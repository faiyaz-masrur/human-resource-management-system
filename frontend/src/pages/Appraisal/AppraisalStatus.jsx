import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const reviewerColumns = ['rm', 'hr', 'hod', 'coo', 'ceo'];

const AppraisalStatus = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get('/appraisals/appraisal-status/');
        setEmployeeData(response.data);
      } catch (err) {
        console.error('Error fetching appraisal status:', err);
        setError('Failed to load appraisal status.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeStatus();
  }, []);

  if (loading) return <div>Loading appraisal status...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appraisal-status-container">
      <h2 className="page-title">Employee Appraisal Status</h2>

      <div className="status-table-wrapper">
        <table className="appraisal-status-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              {reviewerColumns.map(col => (
                <th key={col}>{col.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeeData.length > 0 ? (
              employeeData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employee?.name || '-'}</td>
                  <td>{employee.employee?.id || '-'}</td>
                  {reviewerColumns.map(col => (
                    <td key={`${employee.id}-${col}`} className="checkbox-cell">
                      <input 
                        type="checkbox" 
                        checked={employee[`${col}_review_done`] || false} 
                        readOnly 
                        title={employee[`${col}_review_done`] ? 'Completed' : 'Pending'}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={reviewerColumns.length + 2} className="text-center">
                  No employee data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppraisalStatus;
