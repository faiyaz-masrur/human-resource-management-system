import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

import api from '../../services/api';


const ReportingManagerAppraisal = ({ view, appraisalDetails }) => {
  const defaultFormData = {
    appraisal: appraisalDetails?.emp_appraisal || null,
    achievements_remarks: '',
    training_remarks: '',
    justify_overall_rating: '',
    overall_performance_rating: '',
    potential_rating: '', 
    decision_remarks: '',
  }
  const { user } = useAuth();
  const [formData, setFormData] = useState(defaultFormData);
  const [rmReviewId, setRmReviewId] = useState(appraisalDetails?.rm_review || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportingManager, setIsReportingManager] = useState(false);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    setRmReviewId(appraisalDetails?.rm_review || null);
    setIsReportingManager(user?.id === appraisalDetails?.reporting_manager);
    setFormData(prev => ({
      ...prev,
      appraisal: appraisalDetails?.emp_appraisal || null
    }));
  }, [user, appraisalDetails]);


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view?.isMyAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"MyAppraisal"}/${"MyRmReview"}/`);
        } else if(view?.isReviewAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"ReviewAppraisal"}/${"EmployeeRmReview"}/`);
        } else if(view?.isAllAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllRmReview"}/`);
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
    const fetchRmAppraisalForm = async () => {
      try {
        if (rolePermissions?.view) {
          let res;
          if(view?.isMyAppraisal && rmReviewId){
            res = await api.get(`appraisals/my-rm-review/${rmReviewId}/`);
          } else if(view?.isReviewAppraisal && rmReviewId){
            res = await api.get(`appraisals/employee-rm-review/${rmReviewId}/`);
          } else if(view?.isAllAppraisal && rmReviewId){
            res = await api.get(`appraisals/all-rm-review/${rmReviewId}/`);
          } else {
            return; 
          }
          console.log("Rm Review Form:", res?.data);
          setFormData(res?.data || defaultFormData);
          setRmReviewId(res?.data?.id || null);
        }  
      } catch (error) {
        console.warn("Error fetching rm review form:", error);
        setFormData(defaultFormData);
      }
    };

    fetchRmAppraisalForm();
  }, [rolePermissions, rmReviewId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const validateFormData = (form) => {
    if (!form?.appraisal){
      toast.warning("Employee appraisal not created.");
      return false;
    }
    if (!form?.achievements_remarks?.trim()) {
      toast.warning("Comment on Achievements/Goal completion is required.");
      return false;
    }
    if (!form?.training_remarks?.trim()) {
      toast.warning("Comment on Achievements/Goal completion is required.");
      return false;
    }
    if (!form?.overall_performance_rating?.trim()) {
      toast.warning("Overall Performance Rating is required.");
      return false;
    }
    if (!form?.justify_overall_rating?.trim()) {
      toast.warning("Justification on Overall Performance Rating is required.");
      return false;
    }
    if (!form?.potential_rating?.trim()) {
      toast.warning("Overall Potential Rating is required.");
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
      if (rmReviewId) {
        if (!rolePermissions.edit && appraisalDetails.active_status && isReportingManager) {
          toast.warning("You don't have permission to edit.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.put(`appraisals/my-rm-review/${rmReviewId}/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.put(`appraisals/employee-rm-review/${rmReviewId}/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.put(`appraisals/all-rm-review/${rmReviewId}/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Update Response:", res?.data);
        if (res?.status === 200) {
          toast.success("Review updated successfully.");
        } else {
          toast.error("Failed to update review.");
        }
      } else {
        if (!rolePermissions.create && appraisalDetails.active_status && isReportingManager) {
          toast.warning("You don't have permission to create.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.post(`appraisals/my-rm-review/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.post(`appraisals/employee-rm-review/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.post(`appraisals/all-rm-review/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Create Response:", res?.data);
        if (res?.status === 201) {
          setRmReviewId(res?.data?.id);
          toast.success("Review created successfully.");
        } else {
          toast.error("Failed to create review.");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const performanceRatings = [
    { id: 'performance-1', value: 'does_not_meet', label: 'Does not meet expectation' },
    { id: 'performance-2', value: 'partially_meets', label: 'Partially meets expectation' },
    { id: 'performance-3', value: 'meets_expectation', label: 'Meets expectation' },
    { id: 'performance-4', value: 'meets_most_expectation', label: 'Meets most expectation' },
    { id: 'performance-5', value: 'exceeds_expectation', label: 'Exceeds Expectation' },
  ];

  const potentialRatings = [
    { id: 'potential-1', value: 'low_potential', label: 'Low Potential - improvement not expected; lack of ability and/or motivation.' },
    { id: 'potential-2', value: 'medium_potential', label: 'Medium potential - room for some advancement in terms of performance or expertise.' },
    { id: 'potential-3', value: 'high_potential', label: 'High potential - performing well and ready for promotion immediately.' },
  ];


  const styles = {
    pageWrapper: {
      backgroundColor: "#f9fafb",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: "#fff",
      padding: "32px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      color: "#374151",
    },
    section: {
      marginBottom: "32px",
      paddingBottom: "32px",
      borderBottom: "1px solid #e5e7eb",
    },
    lastSection: {
      marginBottom: "32px",
      paddingBottom: 0,
      borderBottom: "none",
    },
    header: {
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
    sectionDescription: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '20px',
        lineHeight: 1.6,
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
    textAreaDec: {
      width: "100%",
      minHeight: "60px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "12px",
      fontSize: "14px",
      color: "#374151",
      backgroundColor: "#fff",
      resize: "vertical",
      boxSizing: "border-box",
    },
    radioGroupGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '16px',
    },
    radioGroupStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px',
    },
    radioItem: {
      display: 'flex',
      alignItems: 'center',
    },
    radioInput: {
      appearance: 'none',
      width: '18px',
      height: '18px',
      border: '2px solid #d1d5db',
      borderRadius: '50%',
      marginRight: '8px',
      cursor: 'pointer',
      position: 'relative',
      top: '-1px',
    },
    radioInputChecked: {
      borderColor: '#2563eb',
      backgroundColor: '#fff',
    },
    radioLabel: {
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer',
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
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    cancelButton: {
      backgroundColor: "#fff",
      color: "#374151",
      border: "1px solid #d1d5db",
      padding: "10px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
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
  
  // Custom Radio Button component to handle checked state style
  const CustomRadio = ({ id, name, value, label, checked, onChange, isReportingManager, rmReviewId, rolePermissions, appraisalDetails }) => {
    const checkedStyle = checked ? styles.radioInputChecked : {};
    return (
      <div style={styles.radioItem}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          style={{...styles.radioInput, ...checkedStyle}}
          disabled={(appraisalDetails.active_status && isReportingManager) ? rmReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
        />
        <label htmlFor={id} style={styles.radioLabel}>{label}</label>
      </div>
    );
  };


  return (
    <div style={styles.pageWrapper}>
      <form style={styles.container} onSubmit={handleSubmit}>
        
        {/* Achievements/Goal Completion */}
        <div style={styles.section}>
          <div style={styles.header}>
            <label htmlFor="rm-achievements" style={styles.sectionTitle}>
              Achievements/Goal Completion
            </label>
            <span style={styles.wordCountLabel}>Maximum 1000 words</span>
          </div>
          <textarea
            id="rm-achievements"
            name="achievements_remarks"
            style={styles.textArea}
            placeholder="Make any comment that you feel necessary to clarify or supplement the Achievements mentioned above. In addition set goals for next year."
            value={formData.achievements_remarks || ''}
            onChange={handleChange}
            disabled={(appraisalDetails.active_status && isReportingManager) ? rmReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          ></textarea>
        </div>

        {/* Training & Development Plan */}
        <div style={styles.section}>
          <div style={styles.header}>
            <label htmlFor="rm-training" style={styles.sectionTitle}>
              Reporting Manager's remarks for Training and Development Plan
            </label>
          </div>
          <textarea
            id="rm-training"
            name="training_remarks"
            style={styles.textArea}
            placeholder="Reporting managers remarks for Training and Development Plan:"
            value={formData.training_remarks || ''}
            onChange={handleChange}
            disabled={(appraisalDetails.active_status && isReportingManager) ? rmReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          ></textarea>
        </div>

        {/* Overall Assessment */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Overall Assessment</h2>
          <p style={styles.sectionDescription}>
            How are you going to rate an employee's overall performance in terms of meeting or exceeding performance expectations? Select the option that best reflects the employee's level of performance over time.
          </p>
          <div style={styles.radioGroupGrid}>
            {performanceRatings.map((rating) => (
              <CustomRadio
                key={rating.id}
                id={rating.id}
                name="overall_performance_rating"
                value={rating.value}
                label={rating.label}
                checked={formData.overall_performance_rating === rating.value}
                onChange={handleChange}
                isReportingManager={isReportingManager}
                rmReviewId={rmReviewId}
                rolePermissions={rolePermissions}
                appraisalDetails={appraisalDetails}
              />
            ))}
          </div>
          <div style={{...styles.header, justifyContent: 'flex-end'}}>
              <span style={styles.wordCountLabel}>Maximum 1000 words</span>
          </div>
          <textarea
            id="performance-comments"
            name="justify_overall_rating"
            style={styles.textArea}
            placeholder="Provide comments to justify your rating. When crafting your comments, consider the following factors: consistent demonstrations of skills, competencies, and the results they have delivered for the organization."
            value={formData.justify_overall_rating || ''}
            onChange={handleChange}
            disabled={(appraisalDetails.active_status && isReportingManager) ? rmReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
            required
          ></textarea>
        </div>

        {/* Potential Rating */}
        <div style={styles.lastSection}>
          <h2 style={styles.sectionTitle}>Potential Rating</h2>
          <p style={styles.sectionDescription}>
            How are you going to rate an employee's potential? Select the option that best reflects the employee's level of performance over time.
          </p>
          <div style={styles.radioGroupStack}>
            {potentialRatings.map(rating => (
              <CustomRadio
                key={rating.id}
                id={rating.id}
                name="potential_rating"
                value={rating.value}
                label={rating.label}
                checked={formData.potential_rating === rating.value}
                onChange={handleChange}
                isReportingManager={isReportingManager}
                rmReviewId={rmReviewId}
                rolePermissions={rolePermissions}
                appraisalDetails={appraisalDetails}
              />
            ))}
          </div>
          <div style={{...styles.header, justifyContent: 'flex-end'}}>
            <span style={styles.wordCountLabel}>Maximum 500 words</span>
          </div>
          <textarea
            id="potential-comments"
            name="decision_remarks"
            style={styles.textAreaDec}
            placeholder="Remarks on your decision..."
            value={formData.decision_remarks || ''}
            onChange={handleChange}
            disabled={(appraisalDetails.active_status && isReportingManager) ? rmReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
          ></textarea>
        </div>

        {/* Buttons */}
        {isReportingManager && (
          <div style={styles.buttonGroup}>
            {(rmReviewId ? rolePermissions?.edit : rolePermissions?.create) && (
              <button
                type="submit"
                style={{...styles.primaryButton, ...(isSubmitting && styles.buttonDisabled)}}
                disabled={!appraisalDetails.active_status || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportingManagerAppraisal;
