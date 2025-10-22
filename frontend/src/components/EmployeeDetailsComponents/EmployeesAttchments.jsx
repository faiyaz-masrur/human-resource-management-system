import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const EmployeeAttachments = ({  view, employee_id, onBack, onSubmit }) => {
  const { user } = useAuth();
  const defaultAttachments = {
    id: '',
    photo: null,
    signature: null,
    national_id: null,
    passport: null,
    employee_agreement: null
  }
  const [attachments, setAttachments] = useState(defaultAttachments);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view.isAddNewEmployeeProfileView || view.isEmployeeProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"Employee"}/${"EmployeeAttachment"}/`);
        } else if(view.isOwnProfileView){
          res = await api.get(`system/role-permissions/${user.role}/${"MyProfile"}/${"MyAttachment"}/`);
        } else {
          return;
        }
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
    const fetchTrainings = async () => {
      try {
        if (!rolePermissions.view) {
          return;
        }
        let res;
        if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
          res = await api.get(`employees/employee-attatchment/${employee_id}/`);
        } else if(view.isOwnProfileView){
          res = await api.get('employees/my-attatchment/');
        } else {
          return;
        }
        console.log("Employee Attchments: ", res?.data)
        setAttachments(res?.data || defaultAttachments); 
      } catch (error) {
        console.warn("No Employee Attchments found, showing empty form.");
        setAttachments(defaultAttachments);
      }
    };

    fetchTrainings();
  }, [rolePermissions]);


  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid file type (JPEG, PNG, PDF)");
        return;
      }

      setAttachments(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };


  const validateAttatchment = (attachment) => {
    if (!attachment.photo) {
      alert("Photo is required.");
      return false;
    }
    if (!attachment.signature) {
      alert("Signature is required.");
      return false;
    }
    if (!attachment.national_id) {
      alert("Natoinal Id is required.");
      return false;
    }
    
    return true;
  };


  const handleSave = async () => {
    if (!validateAttatchment(attachments)) return;
    console.log("Attachments to save:", attachments);
    try {
      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
        if(attachments.id){
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/employee-attatchment/${employee_id}/`,
            attachments
          );
          console.log("Updateed Employee Attachments:", res?.data);
          if(res.status === 200){
            alert("Employee attachments updated successfully!");
            setAttachments(res?.data || attachments);
          } else {
            alert("Something went wrong!")
          }
        } else {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/employee-attatchment/${employee_id}/`,
            attachments
          );
          console.log("Created Employee Attachments:", res?.data);
          if(res.status === 201){
            alert("Employee attachments created successfully!");
            setAttachments(res?.data || attachments);
          } else {
            alert("Something went wrong!")
          }    
        }
      } else if(view.isOwnProfileView){
        if(attachments.id){
          if (!rolePermissions.edit) {
            alert("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/my-attatchment/`,
            attachments
          );
          console.log("Updateed Attachments:", res?.data);
          if(res.status === 200){
            alert("Your attachments updated successfully!");
            setAttachments(res?.data || attachments);
          } else {
            alert("Something went wrong!")
          }
        } else {
          if (!rolePermissions.create) {
            alert("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/my-attatchment/`,
            attachments
          );
          console.log("Created Attachments:", res?.data);
          if(res.status === 201){
            alert("Your attachments created successfully!");
            setAttachments(res?.data || attachments);
          } else {
            alert("Something went wrong!")
          }    
        }
      } else {
        alert("You don't have permission to perform this action. First save employee official details.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee attachments:", error?.response?.data || error);
      alert("Failed to save attachments.");
    }
  };

  return (
    <div className="employee-attachments">
      {/* First Row - 3 boxes */}
      <div className="row first-row">
        <div className="attachment-box">
          <h3 className="box-title">Photo*</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="photo"
              accept=".jpg,.png" 
              onChange={(e) => handleFileChange('photo', e)}
              disabled={attachments.id ? !rolePermissions.create : !rolePermissions.edit}
              required
            />
            {attachments.photo ? (
              <a 
                href={attachments.photo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {attachments.photo.split('/').pop()}
              </a>
            ) : (
              <label htmlFor="photo" className="file-label">
                Attach File (.jpg / .png)
              </label>
            )}
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">Signature*</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="signature"
              accept=".jpg,.png" 
              onChange={(e) => handleFileChange('signature', e)}
              disabled={attachments.id ? !rolePermissions.create : !rolePermissions.edit}
              required
            />
            {attachments.signature ? (
              <a 
                href={attachments.signature} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {attachments.signature.split('/').pop()}
              </a>
            ) : (
              <label htmlFor="signature" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">National ID*</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="national_id"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('national_id', e)}
              disabled={attachments.id ? !rolePermissions.create : !rolePermissions.edit}
              required
            />
            {attachments.national_id ? (
              <a 
                href={attachments.national_id} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {attachments.national_id.split('/').pop()}
              </a>
            ) : (
              <label htmlFor="national_id" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">Passport</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="passport"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('passport', e)}
              disabled={attachments.id ? !rolePermissions.create : !rolePermissions.edit}
            />
            {attachments.passport ? (
              <a 
                href={attachments.passport} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {attachments.passport.split('/').pop()}
              </a>
            ) : (
              <label htmlFor="passport" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Second Row - 1 box */}
      <div className="row second-row">
        <div className="attachment-box full-width">
          <h3 className="box-title">Employee Agreement</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="employee_agreement"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('employee_agreement', e)}
              disabled={attachments.id ? !rolePermissions.create : !rolePermissions.edit}
            />
            {attachments.employee_agreement ? (
              <a 
                href={attachments.employee_agreement} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {attachments.employee_agreement.split('/').pop()}
              </a>
            ) : (
              <label htmlFor="employee_agreement" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-section">
        {(attachments.id ? rolePermissions.edit : rolePermissions.create) && (
          <button className="btn-success" onClick={handleSave}>
            Save
          </button>
        )}
        <button className="btn-secondary" onClick={onBack}>Back</button>
      </div>
    </div>
  );
};

export default EmployeeAttachments;
