import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const Employees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        const res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeList"}/`);
        console.log("User role permissions:", res.data)
        setRolePermissions(res.data || {}); 
      } catch (error) {
        console.warn("Error fetching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, [user.role]);
  
  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        if (rolePermissions.view) {
          const res = await api.get(`employees/employee-list/`);
          console.log("Employee List:", res.data)
          setEmployeeList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
        } else {
          setEmployeeList([]); 
        } 
      } catch (error) {
        console.warn("Error fetching employee list", error);
        setEmployeeList([]); 
      }
    };

    fetchEmployeeList();
  }, [rolePermissions]);

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`employees/employee-delete/${employeeId}/`);
        // Remove the employee from the list
        setEmployeeList(prev => prev.filter(emp => emp.id !== employeeId));
        console.log('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  return (
    <>
      {/* Custom CSS for the Employee Table Design */}
      <style>
        {`
          /* Base Container & Card Styling */
          .main-content-card {
            margin: 2rem auto;
            max-width: 1200px;
            background-color: white;
            padding: 1.5rem 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            font-family: 'Inter', sans-serif;
          }
          
          /* Section Header */
          .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
          }

          /* Add New Button */
          .add-new-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.25rem;
            background-color: #007bff;
            color: white;
            border-radius: 0.375rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 150ms;
            font-size: 0.9375rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
          }
          .add-new-button:hover {
            background-color: #0056b3;
          }
          .add-new-button__icon {
            width: 1.1rem;
            height: 1.1rem;
          }

          /* Employee Table Styles */
          .employee-table-wrapper {
            overflow-x: auto;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
          }
          .employee-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 100%;
          }
          
          /* Table Header */
          .table-header {
            padding: 0.75rem 1rem;
            text-align: left;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          /* Table Rows */
          .table-row {
            transition: background-color 100ms;
            border-bottom: 1px solid #e5e7eb;
          }
          .table-row:last-child {
            border-bottom: none;
          }
          .employee-table tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .table-row:hover {
            background-color: #f3f4f6;
          }
          
          /* Table Data Cells */
          .table-data {
            padding: 0.75rem 1rem;
            white-space: nowrap;
            font-size: 0.875rem;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
          }
          .table-data--name {
            color: #1f2937;
            font-weight: 500;
          }

          /* Status Badge */
          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 9999px;
            text-transform: capitalize;
          }
          .status-badge--active {
            color: #065f46;
            background-color: #d1fae5;
          }
          .status-badge--inactive {
            color: #991b1b;
            background-color: #fee2e2;
          }

          /* Action Buttons */
          .action-buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
          }
          .action-button {
            padding: 0.5rem;
            border-radius: 0.375rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 150ms;
            border: none;
            cursor: pointer;
          }
          .action-button__icon {
            width: 1rem;
            height: 1rem;
          }
          /* Blue Edit Button */
          .action-button--edit {
            background-color: #dbeafe;
            color: #1d4ed8;
          }
          .action-button--edit:hover {
            background-color: #bfdbfe;
          }
          /* Red Delete Button */
          .action-button--delete {
            background-color: #fee2e2;
            color: #dc2626;
          }
          .action-button--delete:hover {
            background-color: #fecaca;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
          }
        `}
      </style>

      {/* Main Content Card */}
      <div className="main-content-card">
        {/* Section Header */}
        <div className="content-header">
          <h1 className="section-title">All Employees</h1>
          {rolePermissions?.create && (
            <button 
              className="add-new-button" 
              onClick={() => navigate('/employee-details/add-new-employee/')}
            >
              <Plus className="add-new-button__icon" />
              <span>Add New</span>
            </button>
          )}
        </div>

        {/* Employee Data Table */}
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Email</th>
                <th className="table-header">Name</th>
                <th className="table-header">Department</th>
                <th className="table-header">Designation</th>
                <th className="table-header">Active</th>
                {(rolePermissions.edit || rolePermissions.delete) && (
                  <th className="table-header" style={{ textAlign: 'center' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {employeeList.length > 0 ? (
                employeeList.map((employee) => (
                  <tr key={employee.id} className="table-row">
                    <td className="table-data">{employee.id}</td>
                    <td className="table-data">{employee.email}</td>
                    <td className="table-data table-data--name">{employee.name || '-'}</td>
                    <td className="table-data">{employee.department || '-'}</td>
                    <td className="table-data">{employee.designation || '-'}</td>
                    <td className="table-data">
                      <span className={`status-badge ${employee.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
                        {employee.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {(rolePermissions.edit || rolePermissions.delete) && (
                      <td className="table-data">
                        <div className="action-buttons">
                          {rolePermissions.edit && (
                            <button
                              title="Edit"
                              className="action-button action-button--edit"
                              onClick={() => navigate(`/employee-details/employee-profile/${employee.id}`)}
                            >
                              <Pencil className="action-button__icon" />
                            </button>
                          )}
                          {rolePermissions.delete && (
                            <button
                              title="Delete"
                              className="action-button action-button--delete"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 className="action-button__icon" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={(rolePermissions.edit || rolePermissions.delete) ? 7 : 6} 
                    className="empty-state"
                  >
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Employees;