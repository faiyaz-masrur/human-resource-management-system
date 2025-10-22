import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // your configured Axios instance

const AllAppraisals = () => {
  const navigate = useNavigate();

  // ✅ State to store fetched data
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch appraisals from backend API
  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const response = await api.get('/appraisals/all-appraisal/');
        setAppraisals(response.data);
      } catch (err) {
        console.error('Error fetching appraisals:', err);
        setError('Failed to load appraisals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppraisals();
  }, []);

  // ✅ Color code for status
  const getStatusColor = (status) => {
    if (!status) return '#6b7280'; // gray for undefined
    if (status.toLowerCase() === 'active') return '#4CAF50'; // green
    if (status.toLowerCase() === 'inactive') return '#F44336'; // red
    return '#6b7280';
  };

  // ✅ Action handlers
  const handleEditAppraisal = (appraisalId) => {
    navigate(`/appraisal/${appraisalId}/employee`);
  };

  const handleDownloadAppraisal = (appraisalId) => {
    alert(`Downloading appraisal ID: ${appraisalId}`);
    // TODO: implement backend download endpoint
  };

  if (loading) {
    return <div className="loading-message">Loading appraisals...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appraisal-list-container">
      <h2 className="appraisal-list-title">All Appraisals</h2>

      <div className="appraisal-table-responsive">
        <table className="appraisal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Dept</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appraisals.length > 0 ? (
              appraisals.map((appraisal) => (
                <tr key={appraisal.id}>
                  <td>{appraisal.id}</td>
                  <td>{appraisal.name}</td>
                  <td>{appraisal.designation}</td>
                  <td>{appraisal.dept}</td>
                  <td>
                    <span
                      style={{
                        color: getStatusColor(appraisal.status),
                        fontWeight: 'bold',
                      }}
                    >
                      {appraisal.status
                        ? appraisal.status.charAt(0).toUpperCase() +
                          appraisal.status.slice(1)
                        : 'N/A'}
                    </span>
                  </td>
                  <td>{appraisal.start_date || '—'}</td>
                  <td>{appraisal.end_date || '—'}</td>
                  <td>
                    <div className="ar-actions-cell">
                      <button
                        className="action-button-light action-button--edit-light"
                        onClick={() => handleEditAppraisal(appraisal.id)}
                        title="Edit Appraisal"
                      >
                        ✎
                      </button>
                      <button
                        className="action-button-light action-button--download-light"
                        onClick={() => handleDownloadAppraisal(appraisal.id)}
                        title="Download Appraisal"
                      >
                        ⬇
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
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

export default AllAppraisals;
