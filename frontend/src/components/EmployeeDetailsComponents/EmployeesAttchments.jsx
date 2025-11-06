import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeeAttachments = ({ view, employee_id, onBack, onSubmit }) => {
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
    const fetchAttachments = async () => {
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
        console.log("Employee Attachments: ", res?.data)
        setAttachments(res?.data || defaultAttachments); 
      } catch (error) {
        console.warn("No Employee Attachments found, showing empty form.");
        setAttachments(defaultAttachments);
      }
    };

    fetchAttachments();
  }, [rolePermissions]);


  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size must be less than 5MB");
        return;
      }

      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.warning("Please select a valid file type (JPEG, PNG, PDF)");
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
      toast.warning("Photo is required.");
      return false;
    }
    if (!attachment.signature) {
      toast.warning("Signature is required.");
      return false;
    }
    if (!attachment.national_id) {
      toast.warning("National ID is required.");
      return false;
    }
    
    return true;
  };

  // Helper function to get file name
  const getFileName = (file) => {
    if (!file) return null;
    
    // If it's a File object (new upload)
    if (file instanceof File) {
      return file.name;
    }
    
    // If it's a string URL (from API response)
    if (typeof file === 'string') {
      return file.split('/').pop();
    }
    
    return null;
  };

  // Helper function to check if file exists and is displayable
  const hasFile = (file) => {
    return file && (file instanceof File || typeof file === 'string');
  };

  // Download file function
  const downloadFile = async (file, fieldName) => {
    try {
      if (file instanceof File) {
        // For newly uploaded files (File objects)
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (typeof file === 'string') {
        // For files from API (URL strings) - fetch and download
        const response = await fetch(file);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getFileName(file) || `${fieldName}.${file.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab if download fails
      if (typeof file === 'string') {
        window.open(file, '_blank');
      }
    }
  };

  const handleSave = async () => {
    if (!validateAttatchment(attachments)) return;
    console.log("Attachments to save:", attachments);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append all fields to FormData - only File objects
      Object.keys(attachments).forEach(key => {
        if (attachments[key] !== null && attachments[key] !== '' && attachments[key] !== undefined) {
          // Only append if it's a File object (new upload)
          if (attachments[key] instanceof File) {
            formData.append(key, attachments[key]);
          }
          // Skip string URLs (existing files) - backend will keep them
        }
      });

      // For debugging - log what's being sent
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      if(employee_id && (view.isEmployeeProfileView || view.isAddNewEmployeeProfileView)){
        if(attachments.id){
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/employee-attatchment/${employee_id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log("Updated Employee Attachments:", res?.data);
          if(res.status === 200){
            toast.success("Attachments updated successfully!");
            setAttachments(res?.data || attachments);
          } else {
            toast.error("Failed to update attachments!")
          }
        } else {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/employee-attatchment/${employee_id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log("Created Employee Attachments:", res?.data);
          if(res.status === 201){
            toast.success("Attachments created successfully!");
            setAttachments(res?.data || attachments);
          } else {
            toast.error("Failed to create attachments!")
          }    
        }
      } else if(view.isOwnProfileView){
        if(attachments.id){
          if (!rolePermissions.edit) {
            toast.warning("You don't have permission to edit.");
            return;
          }
          const res = await api.put(
            `employees/my-attatchment/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log("Updated Attachments:", res?.data);
          if(res.status === 200){
            toast.success("Attachments updated successfully!");
            setAttachments(res?.data || attachments);
          } else {
            toast.error("Failed to update attachments!")
          }
        } else {
          if (!rolePermissions.create) {
            toast.warning("You don't have permission to create.");
            return;
          }
          const res = await api.post(
            `employees/my-attatchment/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log("Created Attachments:", res?.data);
          if(res.status === 201){
            toast.success("Attachments created successfully!");
            setAttachments(res?.data || attachments);
          } else {
            toast.error("Failed to create attachments!")
          }    
        }
      } else {
        toast.warning("You don't have permission to perform this action.");
        return;
      }
    } catch (error) {
      console.error("Error saving employee attachments:", error?.response?.data || error);
      
      // Handle validation errors specifically
      if (error?.response?.status === 400) {
        const errorData = error.response.data;
        let errorMessage = "Validation errors: ";
        
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            errorMessage += `${field}: ${errorData[field].join(', ')}. `;
          } else {
            errorMessage += `${field}: ${errorData[field]}. `;
          }
        });
        
        toast.error(errorMessage);
      } else {
        toast.error("Error saving attachments!");
      }
    }
  };

  // Handle submit - call the onSubmit prop
  const handleSubmit = () => {
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit();
    } else {
      console.log('Submit clicked - no onSubmit handler provided');
      toast.info('Submit functionality would proceed to next step', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="employee-attachments">
      {/* First Row - 4 boxes */}
      <div className="row first-row">
        <div className="attachment-box">
          <h3 className="box-title">Photo</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="photo"
              accept=".jpg,.png" 
              onChange={(e) => handleFileChange('photo', e)}
              disabled={attachments.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
            {hasFile(attachments.photo) ? (
              <div className="file-display-with-download">
                <div className="file-info">
                  <span className="file-name" title={getFileName(attachments.photo)}>
                    {getFileName(attachments.photo)}
                  </span>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => downloadFile(attachments.photo, 'photo')}
                    title="Download"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="photo" className="file-label">
                Attach File (.jpg / .png)
              </label>
            )}
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">Signature</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="signature"
              accept=".jpg,.png" 
              onChange={(e) => handleFileChange('signature', e)}
              disabled={attachments.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
            {hasFile(attachments.signature) ? (
              <div className="file-display-with-download">
                <div className="file-info">
                  <span className="file-name" title={getFileName(attachments.signature)}>
                    {getFileName(attachments.signature)}
                  </span>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => downloadFile(attachments.signature, 'signature')}
                    title="Download"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="signature" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>

        <div className="attachment-box">
          <h3 className="box-title">National ID</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="national_id"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('national_id', e)}
              disabled={attachments.id ? !rolePermissions.edit : !rolePermissions.create}
              required
            />

            {hasFile(attachments.national_id) ? (
              <div className="file-display-with-download">
                <div className="file-info">
                  <span className="file-name" title={getFileName(attachments.national_id)}>
                    {getFileName(attachments.national_id)}
                  </span>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => downloadFile(attachments.national_id, 'national_id')}
                    title="Download"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </div>
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
              disabled={attachments.id ? !rolePermissions.edit : !rolePermissions.create}
            />
            {hasFile(attachments.passport) ? (
              <div className="file-display-with-download">
                <div className="file-info">
                  <span className="file-name" title={getFileName(attachments.passport)}>
                    {getFileName(attachments.passport)}
                  </span>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => downloadFile(attachments.passport, 'passport')}
                    title="Download"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="passport" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Second Row - 1 box with same size */}
      <div className="row second-row">
        <div className="attachment-box same-size">
          <h3 className="box-title">Employee Agreement</h3>
          <div className="file-input-wrapper">
            <input 
              className="file-input"
              type="file" 
              id="employee_agreement"
              accept=".pdf,.jpg,.png" 
              onChange={(e) => handleFileChange('employee_agreement', e)}
              disabled={attachments.id ? !rolePermissions.edit : !rolePermissions.create}
            />
            {hasFile(attachments.employee_agreement) ? (
              <div className="file-display-with-download">
                <div className="file-info">
                  <span className="file-name" title={getFileName(attachments.employee_agreement)}>
                    {getFileName(attachments.employee_agreement)}
                  </span>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => downloadFile(attachments.employee_agreement, 'employee_agreement')}
                    title="Download"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="employee_agreement" className="file-label">
                Attach File (.pdf / .jpg / .png)
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Buttons - Save on left, Back/Submit on right */}
      <div className="button-section-final">
        <div className="left-buttons">
          {(attachments.id ? rolePermissions.edit : rolePermissions.create) && (
            <button className="btn-save" onClick={handleSave} type="button">
              Save
            </button>
          )}
        </div>
        <div className="right-buttons">
          <button className="btn-back" onClick={onBack} type="button">Back</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttachments;