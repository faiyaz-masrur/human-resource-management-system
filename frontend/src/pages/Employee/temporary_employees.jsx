import { useState, useEffect, use } from 'react';
import { Pencil, Plus } from 'lucide-react'; 
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const Employees = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState([])
    
    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const res = await api.get(`employees/employee-list/`);
                console.log(res.data)
                setEmployeeList(res.data || []); 
            } catch (error) {
                console.warn("Error fatching employee list");
                setEmployeeList([]); 
            }
        };

        fetchEmployeeList();
    }, []);

    // UPDATED FUNCTION: Correctly redirects to the specified profile URL
    const openDetailsView = (employeeId) => {
        // Redirects to: /employee-details/employee-profile/123
        navigate(`employee-details/employee-profile/${employeeId}`);
    };

    return (
        <>
            <div className="main-content-card">
                {/* Section Header (All Employees & Add New Button) */}
                <div className="content-header">
                    <h1 className="section-title">All Employees</h1>
                    <button className="add-new-button" onClick={() => navigate('/employee-details/add-new-employee/')}>
                        <Plus className="add-new-button__icon" />
                        <span>Add New</span>
                    </button>
                </div>

                {/* Employee Data Table */}
                <div className="employee-table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th scope="col" className="table-header">ID</th>
                                <th scope="col" className="table-header">Email</th>
                                <th scope="col" className="table-header">Name</th>
                                <th scope="col" className="table-header">Department</th>
                                <th scope="col" className="table-header">Designation</th>
                                <th scope="col" className="table-header">Status</th>
                                <th scope="col" className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeList.map((employee) => {
                                const statusText = employee.is_active ? "Active" : "Inactive";
                                const statusClass = employee.is_active ? "status-badge--active" : "status-badge--inactive";

                                return (
                                    <tr key={employee.id} className="table-row">
                                        <td className="table-data">{employee.id}</td>
                                        <td className="table-data">{employee.email}</td>
                                        <td className="table-data table-data--name">{employee.name}</td>
                                        <td className="table-data">{employee.department}</td>
                                        <td className="table-data">{employee.designation}</td>
                                        <td className="table-data">
                                            <span className={`status-badge ${statusClass}`}>
                                                {statusText}
                                            </span>
                                        </td>
                                        
                                        {/* Actions column - ONLY contains the Edit button */}
                                        <td className="table-data">
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-button action-button--edit" 
                                                    // **UPDATED:** Calls openDetailsView with employee.id
                                                    onClick={() => openDetailsView(employee.id)}
                                                    title="Edit Employee Details"
                                                >
                                                    <Pencil className="action-button__icon" />
                                                </button>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Employees;