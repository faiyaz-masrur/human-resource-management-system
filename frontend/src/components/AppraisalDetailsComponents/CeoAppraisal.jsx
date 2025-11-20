import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

import api from '../../services/api';


const CeoAppraisal = ({ view, appraisalDetails }) => {

  const defaultFormData = {
    appraisal: appraisalDetails?.emp_appraisal || null,
    remarks: '',
    promo_w_increment: null,
    promo_w_increment_remarks: '',
    promo_w_pp: null,
    promo_w_pp_remarks: '',
    increment_w_no_promo: null,
    increment_w_no_promo_remarks: '',
    pp_only: null,
    pp_only_remarks: '',
    deferred: null,
    deferred_remarks: '',
    remarks_on_your_decision: '',
  }
  const { user } = useAuth();
  const [formData, setFormData] = useState(defaultFormData);
  const [ceoReviewId, setCeoReviewId] = useState(appraisalDetails?.ceo_review || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    setCeoReviewId(appraisalDetails?.ceo_review || null);
    setFormData(prev => ({
      ...prev,
      appraisal: appraisalDetails?.emp_appraisal || null
    }));
  }, [appraisalDetails]);


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view?.isMyAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"MyAppraisal"}/${"MyCeoReview"}/`);
        } else if(view?.isReviewAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"ReviewAppraisal"}/${"EmployeeCeoReview"}/`);
        } else if(view?.isAllAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllCeoReview"}/`);
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
  }, [user?.role, view]);


  useEffect(() => {
    const fetchCeoAppraisalForm = async () => {
      try {
        if (rolePermissions?.view) {
          let res;
          if(view?.isMyAppraisal && ceoReviewId){
            res = await api.get(`appraisals/my-ceo-review/${ceoReviewId}/`);
          } else if(view?.isReviewAppraisal && ceoReviewId){
            res = await api.get(`appraisals/employee-ceo-review/${ceoReviewId}/`);
          } else if(view?.isAllAppraisal && ceoReviewId){
            res = await api.get(`appraisals/all-ceo-review/${ceoReviewId}/`);
          } else {
            return; 
          }
          console.log("Ceo Review Form:", res?.data);
          setFormData(res?.data || defaultFormData);
          setCeoReviewId(res?.data?.id || null);
        }  
      } catch (error) {
        console.warn("Error fetching ceo review form:", error);
        setFormData(defaultFormData);
      }
    };

    fetchCeoAppraisalForm();
  }, [rolePermissions, ceoReviewId]);


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
    if (!form?.remarks?.trim()) {
      toast.warning("Remarks is required.");
      return false;
    }
    if (form?.promo_w_increment === null || form?.promo_w_increment === undefined || form?.promo_w_increment === '') {
      toast.warning("Decision on Promotion with Increment is required.");
      return false;
    }
    if (form?.promo_w_pp === null || form?.promo_w_pp === undefined || form?.promo_w_pp === '') {
      toast.warning("Decision on Promotion with PP is required.");
      return false;
    }
    if (form?.increment_w_no_promo === null || form?.increment_w_no_promo === undefined || form?.increment_w_no_promo === '') {
      toast.warning("Decision on Increment without Promotion is required.");
      return false;
    }
    if (form?.pp_only === null || form?.pp_only === undefined || form?.pp_only === '') {
      toast.warning("Decision on Only Pay Progression is required.");
      return false;
    }
    if (form?.deferred === null || form?.deferred === undefined || form?.deferred === '') {
      toast.warning("Decision on Promotion/Increment/PP Deferred is required.");
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
      if (ceoReviewId) {
        if (!rolePermissions.edit && appraisalDetails.active_status) {
          toast.warning("You don't have permission to edit.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.put(`appraisals/my-ceo-review/${ceoReviewId}/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.put(`appraisals/employee-ceo-review/${ceoReviewId}/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.put(`appraisals/all-ceo-review/${ceoReviewId}/`, formData);
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
        if (!rolePermissions.create && appraisalDetails.active_status) {
          toast.warning("You don't have permission to create.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.post(`appraisals/my-ceo-review/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.post(`appraisals/employee-ceo-review/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.post(`appraisals/all-ceo-review/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Create Response:", res?.data);
        if (res?.status === 201) {
          setCeoReviewId(res?.data?.id);
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


  const decisionsData = [
    {label: "Promotion Recommended with Increment", value: "promo_w_increment", valueRemarks: "promo_w_increment_remarks"},
    {label: "Promotion Recommended with PP only", value: "promo_w_pp", valueRemarks: "promo_w_pp_remarks"},
    {label: "Increment Recommended without Promotion", value: "increment_w_no_promo", valueRemarks: "increment_w_no_promo_remarks"},
    {label: "Only Pay Progression (PP) Recommended", value: "pp_only", valueRemarks: "pp_only_remarks"},
    {label: "Promotion/Increment/PP Deferred", value: "deferred", valueRemarks: "deferred_remarks"},
  ];


  const styles = {
    container: {
      backgroundColor: "#fff",
      padding: "30px 40px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      width: "95%",
      margin: "20px auto",
    },
    section: {
      marginBottom: "40px",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#444",
    },
    wordCount: {
      fontSize: "12px",
      color: "#999",
    },
    textarea: {
      width: "100%",
      height: "100px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "10px",
      fontSize: "13.5px",
      color: "#374151",
      backgroundColor: "#fff",
      resize: "vertical",
    },
    remarkBox: {
      width: "100%",
      height: "60px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "10px",
      fontSize: "13.5px",
      color: "#374151",
      backgroundColor: "#fff",
    },
    decisionGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      marginTop: "10px",
    },
    decisionItem: {
      display: "grid",
      gridTemplateColumns: "280px 150px 1fr",
      alignItems: "center",
      gap: "20px",
    },
    decisionLabel: {
      fontSize: "14px",
      color: "#333",
      fontWeight: "500",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "18px",
    },
    checkboxLabel: {
      fontSize: "14px",
      color: "#444",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    checkbox: {
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      width: "16px",
      height: "16px",
      border: "1.5px solid #ccc",
      borderRadius: "3px",
      backgroundColor: "#fff",
      cursor: "pointer",
      position: "relative",
      display: "inline-block",
    },
    checkboxChecked: {
      backgroundColor: "#007bff",
      borderColor: "#007bff",
    },
    input: {
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      padding: "8px 10px",
      fontSize: "14px",
      width: "100%",
      color: "#374151",
      outline: "none",
      backgroundColor: "#fff",
    },
    remarksSection: {
      marginTop: "40px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-start",
      gap: "15px",
      marginTop: "40px",
    },
    submitButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "8px 24px",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    cancelButton: {
      backgroundColor: "#fff",
      color: "#333",
      padding: "8px 24px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
    special_consideration:{
      backgroundColor: "#fff",
      padding: "8px 24px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "20px",
    },
    inputStyle: {
    backgroundColor: "#fff",
    border: "1px solid #ccc", 
    padding: "4px",
    margin: "0 5px",
    width: "60px" 
    },
  };

  // Small helper for white styled checkbox behavior
  // const WhiteCheckbox = () => {
  //   const [checked, setChecked] = React.useState(false);
  //   return (
  //     <span
  //       style={{
  //         ...styles.checkbox,
  //         ...(checked ? styles.checkboxChecked : {}),
  //       }}
  //       onClick={() => setChecked(!checked)}
  //     >
  //       {checked && (
  //         <span
  //           style={{
  //             position: "absolute",
  //             top: "1px",
  //             left: "4px",
  //             width: "4px",
  //             height: "8px",
  //             border: "solid #fff",
  //             borderWidth: "0 2px 2px 0",
  //             transform: "rotate(45deg)",
  //           }}
  //         />
  //       )}
  //     </span>
  //   );
  // };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      {/* Remarks Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <label style={styles.sectionTitle}>Remarks</label>
          <span style={styles.wordCount}>Maximum 1000 words</span>
        </div>
        <textarea
          style={styles.textarea}
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
          name="remarks"
          value={formData.remarks || ''}
          onChange={handleChange}
          disabled={appraisalDetails.active_status ? ceoReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
          required
        ></textarea>
      </div>

      {/* Decisions Section */}
      <div style={styles.section}>
        <label style={styles.sectionTitle}>Decisions</label>
        <div style={styles.decisionGrid}>
          {decisionsData.map((item) => (
            <div style={styles.decisionItem} key={item.label}>
              <label style={styles.decisionLabel}>{item.label}</label>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name={item.value} // Group radio buttons by name
                    onChange={() => setFormData(prev => ({ ...prev, [item.value]: true }))}
                    checked={formData[item.value] === true}
                    disabled={appraisalDetails.active_status ? ceoReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
                  />{" "} 
                  Yes
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name={item.value} // Group radio buttons by name
                    onChange={() => setFormData(prev => ({ ...prev, [item.value]: false }))}
                    checked={formData[item.value] === false}
                    disabled={appraisalDetails.active_status ? ceoReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
                  />{" "}
                  No
                </label>
              </div>

              <input 
                type="text" 
                style={styles.input} 
                placeholder="Remarks" 
                name={item.valueRemarks}
                value={formData[item.valueRemarks] || ''}
                onChange={handleChange}
                disabled={appraisalDetails.active_status ? ceoReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
              />
            </div>
          ))}
        </div>

        {/* Remarks on Decision */}
          <div className='special_consideration'>
            <label>
              <strong>Special Consideration</strong>: Promote to
              <input type='number' className='inputStyle' /> times
            </label>
          </div>

        <div style={styles.remarksSection}>
          <div style={styles.sectionHeader}>
            <label style={styles.sectionTitle}>Remarks on your decision</label>
            <span style={styles.wordCount}>Maximum 500 words</span>
          </div>
          <textarea
            style={styles.remarkBox}
            placeholder="Please....."
            name="remarks_on_your_decision"
            value={formData.remarks_on_your_decision || ''}
            onChange={handleChange}
            disabled={appraisalDetails.active_status ? ceoReviewId ? !rolePermissions?.edit : !rolePermissions?.create : true}
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        {(ceoReviewId ? rolePermissions?.edit : rolePermissions?.create) && (
          <button
            type="submit"
            style={{...styles.submitButton, ...(isSubmitting && styles.buttonDisabled)}}
            disabled={!appraisalDetails.active_status || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  );
};

export default CeoAppraisal;
