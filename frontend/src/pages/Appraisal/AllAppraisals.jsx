import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';


import api from '../../services/api';

const AllAppraisals = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const [allAppraisalList, setAllAppraisalList] = useState([]);
    const [rolePermissions, setRolePermissions] = useState({});


    useEffect(() => {
        const fetchRolePermissions = async () => {
            try {
                const res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllAppraisalList"}/`);
                console.log("User role permission:", res?.data)
                setRolePermissions(res?.data || {}); 
            } catch (error) {
                console.warn("Error fatching role permissions", error);
                setRolePermissions({}); 
            }
        };

        fetchRolePermissions();
    }, []);


    useEffect(() => {
        const fetchAllAppraisalList= async () => {
            try {
                if (rolePermissions?.view) {
                    const res = await api.get(`appraisals/all-appraisal-list/`);
                    console.log("RM Review Appraisal List:", res?.data);
                    setAllAppraisalList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : [])
                }  
            } catch (error) {
                console.warn("Error fetching rm review appraisal List:", error);
                setAllAppraisalList([]);
            }
        };

        fetchAllAppraisalList();
    }, [rolePermissions]);


    const getStatusColor = (status) => {
        return status ? '#4CAF50' : '#F44336'; 
    };

    
    // to show the static forms
    const handleEditAppraisal = (employee_id) => {
        navigate(`/appraisal/all/details/${employee_id}`); 
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
                        {rolePermissions?.view &&(
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Dept</th>
                                <th>Designation</th>
                                <th>Status</th>
                                {rolePermissions?.edit && (<th>Actions</th>)}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {allAppraisalList.map((appraisal, index) => (
                            <tr key={index}>
                                <td>{appraisal.emp_id}</td>
                                <td>{appraisal.emp_name}</td>
                                <td>{appraisal.emp_dept}</td>
                                <td>{appraisal.emp_des}</td>  
                                <td>
                                    <span 
                                        style={{
                                            color: getStatusColor(appraisal.active_status), 
                                            fontWeight: 'bold' 
                                        }}
                                    >
                                        {
                                            appraisal.active_status ? 'Active' : 'Inactive'
                                        }
                                    </span>
                                </td>
                                <td>
                                    <div className="ar-actions-cell">
                                        {rolePermissions?.edit && (
                                            <button 
                                                className="action-button-light action-button--edit-light" 
                                                onClick={() => (handleEditAppraisal(appraisal.emp_id))}
                                                title="Edit Appraisal"
                                            >
                                                &#9998; {/* Pen emoji for Edit */}
                                            </button>
                                        )}
                                        
                                        {rolePermissions?.download && (
                                            <button 
                                                className="action-button-light action-button--download-light" 
                                                onClick={handleDownloadAppraisal} 
                                                title="Download Appraisal"
                                            >
                                                &#x2193; {/* Down Arrow (Download) emoji */}
                                            </button>
                                        )}
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