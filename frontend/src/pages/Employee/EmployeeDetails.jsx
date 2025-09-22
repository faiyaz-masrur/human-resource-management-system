// src/pages/Employee/EmployeeDetails.jsx
import { useState } from 'react'
import EmployeesOfficialDetails from "../../components/EmployeeDetailsComponents/EmployeesOfficialDetails";
import EmployeesPersonalDetails from "../../components/EmployeeDetailsComponents/EmployeesPersonalDetails";
import EmployeesAddress from "../../components/EmployeeDetailsComponents/EmployeesAddress";
import EmployeesExperience from "../../components/EmployeeDetailsComponents/EmployeesExperience";
import EmployeesEducation from "../../components/EmployeeDetailsComponents/EmployeesEducation";
import EmployeesTrainingCertifications from "../../components/EmployeeDetailsComponents/EmployeesTrainingCertifications";
import EmployeesOtherInfo from "../../components/EmployeeDetailsComponents/EmployeesOtherInfo";
import EmployeesAttchments from "../../components/EmployeeDetailsComponents/EmployeesAttchments";

function EmployeeDetails() {
  const [activeTab, setActiveTab] = useState('official');

  const tabs = [
    { id: 'official', label: 'Official Details', component: <EmployeesOfficialDetails /> },
    { id: 'personal', label: 'Personal Details', component: <EmployeesPersonalDetails /> },
    { id: 'addresses', label: 'Addresses', component: <EmployeesAddress /> },
    { id: 'experience', label: 'Work Experiences', component: <EmployeesExperience /> },
    { id: 'education', label: 'Education', component: <EmployeesEducation /> },
    { id: 'training', label: 'Training & Certifications', component: <EmployeesTrainingCertifications /> },
    { id: 'other', label: 'Other Info', component: <EmployeesOtherInfo /> },
    { id: 'attachments', label: 'Attachments', component: <EmployeesAttchments /> },
  ];

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>
      
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}

export default EmployeeDetails;