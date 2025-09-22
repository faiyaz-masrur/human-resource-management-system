import React, { useState } from 'react';

const EmployeesOfficialDetails = () => {
  const [formData, setFormData] = useState({
    employeeId: '1061',
    employeeUsername: 'liton.das',
    employeeName: 'Liton Kumar Das',
    designation: 'Senior Manager',
    department: 'Human Resource',
    joiningDate: '2025-03-24',
    grade: 'T-XXX',
    reportingManager: 'S.M Jahangir Akhter',
    basicSalary: '',
    role1: 'Manager',
    role2: '',
    isHR: 'Yes'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Employee Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Row */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Employee ID*</label>
          <input
            type="text"
            disabled
            value={formData.employeeId}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Employee Username*</label>
          <input
            type="text"
            disabled
            value={formData.employeeUsername}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Employee Name*</label>
          <input
            type="text"
            disabled
            value={formData.employeeName}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Second Row */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Designation*</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Senior Manager">Senior Manager</option>
            <option value="Manager">Manager</option>
            <option value="Team Lead">Team Lead</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Department*</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Human Resource">Human Resource</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Joining Date*</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Third Row */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Grade*</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="T-XXX">T-XXX</option>
            <option value="M-XXX">M-XXX</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Reporting Manager*</label>
          <select
            name="reportingManager"
            value={formData.reportingManager}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="S.M Jahangir Akhter">S.M Jahangir Akhter</option>
            <option value="Other Manager">Other Manager</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Basic Salary*</label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fourth Row */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Role 1*</label>
          <select
            name="role1"
            value={formData.role1}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Manager">Manager</option>
            <option value="Team Lead">Team Lead</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Role 2*</label>
          <select
            name="role2"
            value={formData.role2}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select --</option>
            <option value="Secondary Role">Secondary Role</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Is HR*</label>
          <select
            name="isHR"
            value={formData.isHR}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Next
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Back
        </button>
      </div>
    </div>
  );
};

export default EmployeesOfficialDetails;