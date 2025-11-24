import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

import api from '../../services/api';

const EmployeeAppraisal = ({ view, appraisalDetails }) => {
  const defaultFormData = {
    employee: appraisalDetails?.emp_id || null,
    achievements_goal_completion: '',
    training_plan: '',
    development_plan: '',
    soft_skills_training: false,
    business_training: false,
    technical_training: false,
    training_description: '',
  }
  const { user } = useAuth();
  const [formData, setFormData] = useState(defaultFormData);
  const [appraisalId, setAppraisalId] = useState(appraisalDetails?.emp_appraisal || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    setAppraisalId(appraisalDetails?.emp_appraisal || null);
    setFormData(prev => ({
      ...prev,
      employee: appraisalDetails?.emp_id || null
    }));
  }, [appraisalDetails]);


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view?.isMyAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"MyAppraisal"}/${"MyEmployeeAppraisal"}/`);
        } else if(view?.isReviewAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"ReviewAppraisal"}/${"EmployeeEmployeeAppraisal"}/`);
        } else if(view?.isAllAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllEmployeeAppraisal"}/`);
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
    const fetchEmployeeAppraisalForm = async () => {
      try {
        if (rolePermissions?.view) {
          let res;
          if(view?.isMyAppraisal && appraisalId){
            res = await api.get(`appraisals/my-employee-appraisal/${appraisalId}/`);
          } else if(view?.isReviewAppraisal && appraisalId){
            res = await api.get(`appraisals/review-employee-appraisal/${appraisalId}/`);
          } else if(view?.isAllAppraisal && appraisalId){
            res = await api.get(`appraisals/all-employee-appraisal/${appraisalId}/`);
          } else {
            return; 
          }
          console.log("Employee Appraisal Form:", res?.data);
          setFormData(res?.data || defaultFormData);
          setAppraisalId(res?.data?.id || null);
        }  
      } catch (error) {
        console.warn("Error fetching employee appraisal form:", error);
        setFormData(defaultFormData);
      }
    };

    fetchEmployeeAppraisalForm();
  }, [rolePermissions, appraisalId]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const validateFormData = (form) => {
    if (!form?.achievements_goal_completion?.trim()) {
      toast.warning("Achievements/Goal completion is required.");
      return false;
    }
    if (!form?.training_plan?.trim()) {
      toast.warning("Training & Development plan is required.");
      return false;
    }
    if (!form?.development_plan?.trim()) {
      toast.warning("Training & Development plan is required.");
      return false;
    }
    
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData)) return;
    setIsSubmitting(true);
    try {
      let res;
      if (appraisalId) {
        if (!rolePermissions.edit && appraisalDetails.active_status) {
          toast.warning("You don't have permission to edit.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.put(`appraisals/my-employee-appraisal/${appraisalId}/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.put(`appraisals/review-employee-appraisal/${appraisalId}/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.put(`appraisals/all-employee-appraisal/${appraisalId}/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Update Response:", res?.data);
        if (res?.status === 200) {
          toast.success("Appraisal updated successfully.");
        } else {
          toast.error("Failed to update appraisal.");
        }
      } else {
        if (!rolePermissions.create && appraisalDetails.active_status) {
          toast.warning("You don't have permission to create.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.post(`appraisals/my-employee-appraisal/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.post(`appraisals/review-employee-appraisal/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.post(`appraisals/all-employee-appraisal/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Create Response:", res?.data);
        if (res?.status === 201) {
          setAppraisalId(res?.data?.id);
          toast.success("Appraisal created successfully.");
        } else {
          toast.error("Failed to create appraisal.");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const styles = {
    pageWrapper: {
      backgroundColor: "#f9fafb",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh",
    },
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: "#fff",
      padding: "32px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    },
    formSection: {
      marginBottom: "32px",
    },
    headerGroup: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
    },
    wordCountLabel: {
      fontSize: "12px",
      color: "#9ca3af",
    },
    textArea: {
      width: "100%",
      minHeight: "120px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "12px",
      fontSize: "14px",
      color: "#374151",
      backgroundColor: "#fff",
      resize: "vertical",
      boxSizing: "border-box",
    },
    textAreaDesc: {
      width: "100%",
      minHeight: "70px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "12px",
      fontSize: "14px",
      color: "#374151",
      backgroundColor: "#fff",
      resize: "vertical",
      boxSizing: "border-box",
    },
    checkboxGroup: {
      display: 'flex',
      gap: '24px',
      marginBottom: '16px',
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    checkboxInput: {
      display: 'none', // Hide the default checkbox
    },
    checkboxCustom: {
      width: '18px',
      height: '18px',
      border: '2px solid #d1d5db',
      borderRadius: '4px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      transition: 'all 0.2s',
    },
    checkboxCustomChecked: {
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
    },
    checkmark: {
      color: '#fff',
      fontSize: '14px',
      visibility: 'hidden',
    },
    checkmarkVisible: {
      visibility: 'visible',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#374151',
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
    },
    primaryButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
    },
    secondaryButton: {
      backgroundColor: "#fff",
      color: "#374151",
      border: "1px solid #d1d5db",
      padding: "10px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    messageContainer: {
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    successMessage: {
        backgroundColor: '#dcfce7',
        color: '#166534',
    },
    errorMessage: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
    }
  };

  // Custom Checkbox Component for styling
  const CustomCheckbox = ({ id, name, label, checked, onChange, rolePermissions, appraisalId, appraisalDetails }) => (
    <label htmlFor={id} style={styles.checkboxItem}>
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={styles.checkboxInput}
        disabled={appraisalDetails.active_status ? appraisalId ? !rolePermissions?.edit : !rolePermissions?.create : true}
      />
      <span style={{ ...styles.checkboxCustom, ...(checked && styles.checkboxCustomChecked) }}>
        <span style={{ ...styles.checkmark, ...(checked && styles.checkmarkVisible) }}>✔</span>
      </span>
      <span style={styles.checkboxLabel}>{label}</span>
    </label>
  );

  return (
    <div style={styles.pageWrapper}>
      <form style={styles.container} onSubmit={handleSubmit}>

        {/* Achievements/Goal Completion */}
        <div style={styles.formSection}>
          <div style={styles.headerGroup}>
            <label htmlFor="achievements" style={styles.sectionTitle}>
              Achievements/Goal Completion
            </label>
            <span style={styles.wordCountLabel}>Maximum 1000 words</span>
          </div>
          <textarea
            id="achievements"
            name="achievements_goal_completion"
            style={styles.textArea}
            placeholder="You are encouraged to provide details of your key achievements and contributions during the review period, with specific examples where possible."
            value={formData.achievements_goal_completion || ''}
            onChange={handleChange}
            disabled={appraisalDetails.active_status ? appraisalId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          />
        </div>

        {/* Training & Development Plan (Top) */}
        <div style={styles.formSection}>
          <div style={styles.headerGroup}>
            <label htmlFor="training_needs_top" style={styles.sectionTitle}>
              Training & Development Plan
            </label>
            <span style={styles.wordCountLabel}>Maximum 1000 words</span>
          </div>
          <textarea
            id="training_needs_top"
            name="training_plan"
            style={styles.textArea}
            placeholder="What do you consider to be your main strengths that contribute to your overall performance?"
            value={formData.training_plan || ''}
            onChange={handleChange}
            disabled={appraisalDetails.active_status ? appraisalId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          />
        </div>

        {/* Training & Development Plan (Bottom - No Title) */}
        <div style={styles.formSection}>
          <textarea
            id="training_needs_bottom"
            name="development_plan"
            style={styles.textArea}
            placeholder="What do you consider to be the aspects of your performance that needs to be improved?"
            value={formData.development_plan || ''}
            onChange={handleChange}
            disabled={appraisalDetails.active_status ? appraisalId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          />
        </div>

        {/* Further Training Section */}
        <div style={styles.formSection}>
          <div style={styles.headerGroup}>
            <label style={styles.sectionTitle}>
              What further training and/or experience do you feel would help your future performance and development?
            </label>
            <span style={styles.wordCountLabel}>Maximum 500 words</span>
          </div>
          <div style={styles.checkboxGroup}>
            <CustomCheckbox
              id="soft-skills"
              name="soft_skills_training"
              label="Soft Skills Training"
              checked={formData.soft_skills_training  || false}
              onChange={handleChange}
              rolePermissions={rolePermissions}
              appraisalId={appraisalId}
              appraisalDetails={appraisalDetails}
            />
            <CustomCheckbox
              id="business-training"
              name="business_training"
              label="Business Training"
              checked={formData.business_training || false}
              onChange={handleChange}
              rolePermissions={rolePermissions}
              appraisalId={appraisalId}
              appraisalDetails={appraisalDetails}
            />
            <CustomCheckbox
              id="technical-training"
              name="technical_training"
              label="Technical Training"
              checked={formData.technical_training || false}
              onChange={handleChange}
              rolePermissions={rolePermissions}
              appraisalId={appraisalId}
              appraisalDetails={appraisalDetails}
            />
          </div>
          <textarea
            id="training_description"
            name="training_description"
            style={styles.textAreaDesc}
            placeholder="Please Specify (if any):"
            value={formData.training_description || ''}
            onChange={handleChange}
            disabled={appraisalDetails.active_status ? appraisalId ? !rolePermissions?.edit : !rolePermissions?.create : true}
          />
        </div>
        
        {/* Buttons */}
          <div style={styles.buttonGroup}>
            {(appraisalId ? rolePermissions?.edit : rolePermissions?.create) && (
              <button
                type="submit"
                style={{...styles.primaryButton, ...(isSubmitting && styles.buttonDisabled)}}
                disabled={!appraisalDetails.active_status || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
      </form>
    </div>
  );
};

export default EmployeeAppraisal;

