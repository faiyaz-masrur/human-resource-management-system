import React from 'react';

const OtherAppraisals = () => {
  const appraisals = [
    { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', status: 'Completed', dept: 'R&D', experience: 2 },
    { id: 1066, name: 'Saim Bin Salim', designation: 'Associate Business Analyst', status: 'Pending', dept: 'R&D', experience: 5 },
    { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', status: 'Completed', dept: 'R&D', experience: 2 },
  ];

  const getStatusColor = (status) => {
    return status === 'Completed' ? '#4CAF50' : '#F44336';
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
              <th>Experience</th>
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
                <td>{appraisal.experience}</td>
                <td>
                  <button className="action-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5v-.5h-.5a.5.5 0 0 1-.5-.5V11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtherAppraisals;
