import { useState, useEffect, use } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const AllAppraisals = () => {
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


  return (
    <>
      {/* Custom CSS for the Employee Table Design */}
      <style>
        {`
          /* Base Container & Card Styling */
          .main-content-card {
            margin: 2rem auto;
            max-width: 1200px; /* Limit width for desktop */
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
            font-size: 1.5rem; /* ~text-2xl */
            font-weight: 700; /* bold */
            color: #1f2937;
          }

          /* Add New Button */
          .add-new-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.25rem;
            background-color: #007bff; /* Bright Blue */
            color: white;
            border-radius: 0.375rem; /* Slightly less rounded than full */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 150ms;
            font-size: 0.9375rem; /* ~text-base */
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
            border-top: 1px solid #f3f4f6; /* Subtle line above the table */
            padding-top: 0.5rem;
          }
          .employee-table {
            min-width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          
          /* Table Header */
          .table-header th {
            padding: 0.75rem 0.5rem;
            text-align: left;
            font-size: 0.8rem; /* smaller font size for headers */
            font-weight: 500;
            color: #6b7280; /* Gray text for headers */
            text-transform: capitalize; /* Capitalize only first letter for cleaner look */
            cursor: pointer;
            transition: color 150ms;
          }
          
          /* Table Rows */
          .table-row {
            transition: background-color 100ms;
            border-bottom: 1px solid #f3f4f6;
          }
          /* Subtle gray background on alternate rows */
          .employee-table tbody tr:nth-child(even) {
            background-color: #fcfcfc;
          }
          .table-row:hover {
            background-color: #f5f5f5;
          }
          
          /* Table Data Cells */
          .table-data {
            padding: 0.8rem 0.5rem;
            white-space: nowrap;
            font-size: 0.875rem;
            color: #374151; /* Darker text for content */
          }
          .table-data--name {
            color: #1f2937;
          }

          /* Status Badge */
          .status-badge {
            display: inline-block;
            padding: 0 0.5rem;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 9999px;
            text-transform: capitalize;
            height: 1.5rem;
            line-height: 1.5rem;
          }
          .status-badge--active {
            color: #10b981; /* Green text */
            background-color: #ecfdf5; /* Light green background (not visible in screenshot but good practice) */
          }
          .status-badge--inactive {
            color: #ef4444; /* Red text */
            background-color: #fef2f2; /* Light red background */
          }

          /* Action Buttons */
          .action-buttons {
            display: flex;
            gap: 0.5rem;
          }
          .action-button {
            padding: 0.5rem;
            border-radius: 9999px;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 150ms;
            border: none;
            cursor: pointer;
          }
          .action-button__icon {
            width: 1rem;
            height: 1rem;
          }
          /* Blue Edit Button */
          .action-button--edit {
            background-color: #e0f2fe; /* Light blue */
            color: #3b82f6; /* Blue icon */
          }
          .action-button--edit:hover {
            background-color: #bfdbfe; 
          }
          /* Red Delete Button */
          .action-button--delete {
            background-color: #fee2e2; /* Light red */
            color: #ef4444; /* Red icon */
          }
          .action-button--delete:hover {
            background-color: #fecaca;
          }
        `}
      </style>

      {/* Main Content Card - The part that contains the table */}
      <div className="main-content-card">
        {/* Section Header (All Employees & Add New Button) */}
        <div className="content-header">
          <h1 className="section-title">All Appraisals</h1>
        </div>

        {/* Employee Data Table */}
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th scope="col" className="table-header">ID</th>
                <th scope="col" className="table-header">Name</th>
                <th scope="col" className="table-header">Department</th>
                <th scope="col" className="table-header">Designation</th>
                <th scope="col" className="table-header">Status</th>
                <th scope="col" className="table-header">Start Date</th>
                <th scope="col" className="table-header">End Date</th>
                {user.is_hr && 
                  <th scope="col" className="table-header">Actions</th>
                }
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee) => (
                <tr key={employee.id} className="table-row">
                  <td className="table-data">{employee.id}</td>
                  <td className="table-data">{employee.email}</td>
                  <td className="table-data table-data--name">{employee.name}</td>
                  <td className="table-data">{employee.department}</td>
                  <td className="table-data">{employee.designation}</td>
                  <td className="table-data">{employee.is_active ? "Active" : "Inactive"}</td>
                  {user.is_hr && 
                    <td className="table-data">
                      <div className="action-buttons">
                        {/* Edit Button */}
                        <button
                          title="Edit"
                          className="action-button action-button--edit"
                          onClick={() => navigate(`/employee-details/employee-profile/${employee.id}`)}
                        >
                          <Pencil className="action-button__icon" />
                        </button>
                        {/* Delete Button */}
                        <button
                          title="Delete"
                          className="action-button action-button--delete"
                          onClick={() => console.log('Delete:', employee.id)}
                        >
                          <Trash2 className="action-button__icon" />
                        </button>
                      </div>
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllAppraisals;
