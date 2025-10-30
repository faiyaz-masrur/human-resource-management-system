import React from 'react';
import { useNavigate } from 'react-router-dom';

const AllAppraisals = () => {
    // 2. Call useNavigate hook to get the navigation function
    const navigate = useNavigate(); 
    
    const appraisals = [
        { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', dept: 'R&D', status: 'active', start_date:'', end_date:''},
        { id: 1066, name: 'Saim Bin Salim', designation: 'Associate Business Analyst', dept: 'R&D', status: 'inactive'},
        { id: 2010, name: 'Mamun Ur Rashid', designation: 'Assistant Vice President', dept: 'R&D', status: 'active'},
    ];

    const getStatusColor = (status) => {
        // color mapping based on 'active' (green) and 'inactive' (red)
        if (status.toLowerCase() === 'active') {
            return '#4CAF50'; // Green
        }
        if (status.toLowerCase() === 'inactive') {
            return '#F44336'; // Red
        }
        
    };
    
    // to show the static forms
    const handleEditAppraisal = () => {
        navigate('/appraisal/employee'); 
    };
    
    const handleDownloadAppraisal = () => {
        console.log("Download action triggered!");
        // define download logic - later
        alert("Downloading appraisal data...");
    };

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appraisals.map((appraisal, index) => (
                            <tr key={index}>
                                <td>{appraisal.id}</td>
                                <td>{appraisal.name}</td>
                                <td>{appraisal.designation}</td>
                                <td>{appraisal.dept}</td>
                                <td>
                                    <span style={{ color: getStatusColor(appraisal.status), fontWeight: 'bold' }}>
                                        {appraisal.status.charAt(0).toUpperCase() + appraisal.status.slice(1)}
                                    </span>
                                </td>
                                
                                <td>
                                    <div className="ar-actions-cell">
                                        
                                        <button 
                                            className="action-button-light action-button--edit-light" 
                                            onClick={handleEditAppraisal}
                                            title="Edit Appraisal"
                                        >
                                            &#9998; {/* Pen emoji for Edit */}
                                        </button>

                                        
                                        <button 
                                            className="action-button-light action-button--download-light" 
                                            onClick={handleDownloadAppraisal} 
                                            title="Download Appraisal"
                                        >
                                            &#x2193; {/* Down Arrow (Download) emoji */}
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

export default AllAppraisals;