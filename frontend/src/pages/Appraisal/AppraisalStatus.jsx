import React from 'react';

// Dummy data to simulate employee records and their appraisal status
const employeeData = [
  { 
    name: 'Liton Kumar Das', id: '1042', 
    rm: true, // RM has completed their review (checked)
    hr: false, // HR hasn't started/completed (unchecked)
    hod: false, 
    coo: false, 
    ceo: false 
  },
  { 
    name: 'Saim Bin Selim', id: '1125', 
    rm: true, 
    hr: true, // HR has completed
    hod: true, // HOD has completed
    coo: false, 
    ceo: false 
  },
  { 
    name: 'Bibi Mariom', id: '1190', 
    rm: true, 
    hr: true, 
    hod: true, 
    coo: true, 
    ceo: true // All completed
  },
  { 
    name: 'Faiyaz Masrur', id: '1194', 
    rm: false, // RM review is pending
    hr: false, 
    hod: false, 
    coo: false, 
    ceo: false 
  },
];

const AppraisalStatus = () => {
  const reviewerColumns = ['RM', 'HR', 'HOD', 'COO', 'CEO'];

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
                <th key={col}>{col}</th>
              ))}
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.id}</td>
                
                {/* Dynamically render the status checkboxes */}
                {reviewerColumns.map(col => (
                  <td key={`${employee.id}-${col.toLowerCase()}`} className="checkbox-cell">
                    {/* The checked state is determined by the boolean value in the employee object */}
                    <input 
                      type="checkbox" 
                      checked={employee[col.toLowerCase()]}
                      readOnly // Makes the checkbox display status without being directly editable
                    />
                  </td>
                ))}
                <td>
                  ⬇️
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppraisalStatus;