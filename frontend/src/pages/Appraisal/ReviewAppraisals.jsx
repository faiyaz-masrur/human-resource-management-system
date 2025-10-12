import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const ReviewAppraisals = () => {
  // 2. Call useNavigate hook to get the navigation function
  const navigate = useNavigate(); 
    
  const appraisals = [
    { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', status: 'Completed', dept: 'R&D'},
    { id: 1066, name: 'Saim Bin Salim', designation: 'Associate Business Analyst', status: 'Pending', dept: 'R&D'},
    { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', status: 'Completed', dept: 'R&D'},
  ];

  const getStatusColor = (status) => {
    return status === 'Completed' ? '#4CAF50' : '#F44336';
  };
  
  // Use it for dynamic value for specific appraisal id
  /*const handleEditAppraisal = (appraisalId) => {
    navigate(`/appraisal/employee/${appraisalId}`); 
    
  };
  */

  // Use it for static value to show the static forms
    const handleEditAppraisal = () => {
    navigate('/appraisal/employee'); 
  };

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
            {appraisals.map((appraisal, index) => (
              <tr key={index}>
                <td>{appraisal.id}</td>
                <td>{appraisal.name}</td>
                <td>{appraisal.designation}</td>
                <td>
                  <span style={{ color: getStatusColor(appraisal.status), fontWeight: 'bold' }}>
                    {appraisal.status}
                  </span>
                </td>
                <td>{appraisal.dept}</td>
                <td>
                  <div className="ar-actions-cell">
                    <button 
                        className="action-button-light action-button--edit-light" 
                        onClick={() => handleEditAppraisal()}
                        title="edit appraisal"
                    >
                        &#9998; {/* Pen emoji for Edit */}
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewAppraisals;
