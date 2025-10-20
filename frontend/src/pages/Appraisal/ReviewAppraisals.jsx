import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReviewAppraisals = () => {
  const navigate = useNavigate();

  // ✅ State
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch review appraisals dynamically
  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const response = await api.get('/appraisals/review-appraisal/');
        setAppraisals(response.data);
      } catch (err) {
        console.error('Error fetching review appraisals:', err);
        setError('Failed to load appraisals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppraisals();
  }, []);

  // ✅ Status color
  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    return status.toLowerCase() === 'completed' ? '#4CAF50' : '#F44336';
  };

  // ✅ Navigate to specific employee appraisal
  const handleEditAppraisal = (employeeId) => {
    navigate(`/appraisal/employee/${employeeId}`);
  };

  if (loading) return <div className="loading-message">Loading appraisals...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appraisal-list-container">
      <h2 className="appraisal-list-title">All Pending Appraisals</h2>
      <div className="appraisal-table-responsive">
        <table className="appraisal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Dept</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appraisals.length > 0 ? (
              appraisals.map((appraisal) => (
                <tr key={appraisal.employee.id}>
                  <td>{appraisal.employee.id}</td>
                  <td>{appraisal.employee.name}</td>
                  <td>{appraisal.employee.designation?.name || '-'}</td>
                  <td>
                    <span
                      style={{ color: getStatusColor(appraisal.status), fontWeight: 'bold' }}
                    >
                      {appraisal.status
                        ? appraisal.status.charAt(0).toUpperCase() + appraisal.status.slice(1)
                        : 'N/A'}
                    </span>
                  </td>
                  <td>{appraisal.employee.department?.name || '-'}</td>
                  <td>
                    <button
                      className="action-button-light action-button--edit-light"
                      onClick={() => handleEditAppraisal(appraisal.employee.id)}
                      title="Edit Appraisal"
                    >
                      ✎
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No appraisals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewAppraisals;
