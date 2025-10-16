import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const EmployeeAttachments = ({ onBack, onSubmit }) => {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState({
    photo: null,
    nationalId: null,
    passport: null,
    employeeAgreement: null
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = () => {
    if (!attachments.photo || !attachments.nationalId) {
      alert('Please attach required files: Photo and National ID');
      return;
    }
    onSubmit(attachments);
  };

  return (
    <div className="employee-attachments">
      {/* First Row - 3 boxes */}
      <div className="row first-row">
        <div className="attachment-box">
          <h3 className="box-title">Photo*</h3>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="photo"
              accept=".jpg,.png" 
              onChange={(e) => handleFileChange('photo', e)}
              className="file-input"
            />
            <label htmlFor="photo" className="file-label">
               Attach File (.jpg / .png)
            </label>
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">National ID*</h3>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="nationalId"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('nationalId', e)}
              className="file-input"
            />
            <label htmlFor="nationalId" className="file-label">
               Attach File (.pdf / .jpg / .png)
            </label>
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">Passport</h3>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="passport"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('passport', e)}
              className="file-input"
            />
            <label htmlFor="passport" className="file-label">
               Attach File (.pdf / .jpg / .png)
            </label>
          </div>
        </div>
      </div>

      {/* Second Row - 1 box */}
      <div className="row second-row">
        <div className="attachment-box full-width">
          <h3 className="box-title">Employee Agreement</h3>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="employeeAgreement"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('employeeAgreement', e)}
              className="file-input"
            />
            <label htmlFor="employeeAgreement" className="file-label">
               Attach File (.pdf / .jpg / .png)
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-section">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default EmployeeAttachments;
