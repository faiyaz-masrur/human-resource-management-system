
import { useState } from 'react'
import { useParams } from "react-router-dom";
import EmployeesOfficialDetails from "../../components/EmployeeDetailsComponents/EmployeesOfficialDetails";
import EmployeesPersonalDetails from "../../components/EmployeeDetailsComponents/EmployeesPersonalDetails";
import EmployeesAddress from "../../components/EmployeeDetailsComponents/EmployeesAddress";
import EmployeesExperience from "../../components/EmployeeDetailsComponents/EmployeesExperience";
import EmployeesEducation from "../../components/EmployeeDetailsComponents/EmployeesEducation";
import EmployeesTrainingCertifications from "../../components/EmployeeDetailsComponents/EmployeesTrainingCertifications";
import EmployeesOtherInfo from "../../components/EmployeeDetailsComponents/EmployeesOtherInfo";
import EmployeesAttchments from "../../components/EmployeeDetailsComponents/EmployeesAttchments";

function EmployeeDetails({ view }) {
  const [activeTab, setActiveTab] = useState('official');
  const { employee_id } = useParams();

  const tabs = [
    { id: 'official', label: 'Official Details' },
    { id: 'personal', label: 'Personal Details' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'experience', label: 'Work Experiences' },
    { id: 'education', label: 'Education' },
    { id: 'training', label: 'Training & Certifications' },
   /* { id: 'other', label: 'Other Info' },*/
    { id: 'attachments', label: 'Attachments' },
  ];

  // Function to handle Next button click
  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  // Function to handle Back button click
  const handleBack = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  // Render the current tab component
  const renderTabContent = () => {
    switch(activeTab) {
      case 'official':
        return <EmployeesOfficialDetails view={view} employee_id={employee_id} onNext={handleNext} />;
      case 'personal':
        return <EmployeesPersonalDetails view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'addresses':
        return <EmployeesAddress view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'experience':
        return <EmployeesExperience view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'education':
        return <EmployeesEducation view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'training':
        return <EmployeesTrainingCertifications view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'other':
        return <EmployeesOtherInfo view={view} employee_id={employee_id} onNext={handleNext} onBack={handleBack} />;
      case 'attachments':
        return <EmployeesAttchments view={view} employee_id={employee_id} onBack={handleBack} />;
      default:
        return <EmployeesOfficialDetails view={view} employee_id={employee_id} onNext={handleNext} />;
    }
  };

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
        {renderTabContent()}
      </div>
    </div>
  );
}

export default EmployeeDetails;