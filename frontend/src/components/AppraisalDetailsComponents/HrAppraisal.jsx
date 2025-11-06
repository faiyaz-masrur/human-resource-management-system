import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

import api from '../../services/api';


const HrAppraisal = ({ view, appraisalDetails }) => {

  const defaultFormData = {
    appraisal: appraisalDetails?.emp_appraisal || null,
    remarks_hr: '',
    casual_leave_taken: null,
    sick_leave_taken: null,
    annual_leave_taken: null,
    on_time_count: null, 
    delay_count: null,
    early_exit_count: null,
    current_basic: appraisalDetails?.emp_basic_salary || null,
    promo_with_increment_proposed_basic: null,
    promo_without_increment_proposed_basic: null,
    increment_proposed_basic: null,
    pp_proposed_basic: null,
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
  const [hrReviewId, setHrReviewId] = useState(appraisalDetails?.hr_review || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    setHrReviewId(appraisalDetails?.hr_review || null);
  }, [appraisalDetails]);


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        let res;
        if(view?.isMyAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"MyAppraisal"}/${"MyHrReview"}/`);
        } else if(view?.isReviewAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"ReviewAppraisal"}/${"EmployeeHrReview"}/`);
        } else if(view?.isAllAppraisal){
          res = await api.get(`system/role-permissions/${user.role}/${"AllAppraisal"}/${"AllHrReview"}/`);
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
    const fetchHrAppraisalForm = async () => {
      try {
        if (rolePermissions?.view) {
          let res;
          if(view?.isMyAppraisal && hrReviewId){
            res = await api.get(`appraisals/my-hr-review/${hrReviewId}/`);
          } else if(view?.isReviewAppraisal && hrReviewId){
            res = await api.get(`appraisals/employee-hr-review/${hrReviewId}/`);
          } else if(view?.isAllAppraisal && hrReviewId){
            res = await api.get(`appraisals/all-hr-review/${hrReviewId}/`);
          } else {
            return; 
          }
          console.log("Hr Review Form:", res?.data);
          setFormData(res?.data || defaultFormData);
          setHrReviewId(res?.data?.id || null);
        }  
      } catch (error) {
        console.warn("Error fetching hr review form:", error);
        setFormData(defaultFormData);
      }
    };

    fetchHrAppraisalForm();
  }, [rolePermissions]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const calculateTotalLeave = (casual, sick, annual) => {
    return (Number(casual) || 0) + (Number(sick) || 0) + (Number(annual) || 0);
  };

  const calculateAttendancePercentage = (onTime, delay, earlyExit) => {
    const totalDays = (Number(onTime) || 0) + (Number(delay) || 0) + (Number(earlyExit) || 0);
    if (totalDays === 0) return "N/A";
    const attendancePercentage = ((Number(onTime) || 0) / totalDays) * 100;
    return `${attendancePercentage.toFixed(2)}%`;
  };


  const calculateGross = (basic, factor) => {
    if (!basic || !factor) return null;
    return Math.round(Number(basic) / Number(factor));
  }


  const calculateGrossDifference = (currentGross, proposedGross) => {
    if (!currentGross || !proposedGross) return null;
    return (Number(proposedGross) - Number(currentGross));
  }


  const validateFormData = (form) => {
    if (!form?.appraisal){
      toast.warning("Employee appraisal not created.");
      return false;
    }
    if (!form?.remarks_hr?.trim()) {
      toast.warning("Remarks from HR is required.");
      return false;
    }
    if (!form?.casual_leave_taken) {
      toast.warning("Casual leave details is required.");
      return false;
    }
    if (!form?.sick_leave_taken) {
      toast.warning("Sick leave details is required.");
      return false;
    }
    if (!form?.annual_leave_taken) {
      toast.warning("Annual leave details is required.");
      return false;
    }
    if (!form?.on_time_count) {
      toast.warning("Attendance On Time is required.");
      return false;
    }
    if (!form?.delay_count) {
      toast.warning("Attendance On Delay is required.");
      return false;
    }
    if (!form?.early_exit_count) {
      toast.warning("Attendance On Early Exit is required.");
      return false;
    }
    if (!form?.current_basic) {
      toast.warning("Basic Salary not set in Employee Profile.");
      return false;
    }
    if (!form?.promo_with_increment_proposed_basic) {
      toast.warning("Proposed Basic on Promotion with Increment is required.");
      return false;
    }
    if (!form?.promo_without_increment_proposed_basic) {
      toast.warning("Proposed Basic on Promotion without Increment is required.");
      return false;
    }
    if (!form?.increment_proposed_basic) {
      toast.warning("Proposed Basic on Increment only is required.");
      return false;
    }
    if (!form?.pp_proposed_basic) {
      toast.warning("Proposed Basic on Pay Progression is required.");
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
      if (hrReviewId) {
        if (!rolePermissions.edit) {
          toast.warning("You don't have permission to edit.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.put(`appraisals/my-hr-review/${hrReviewId}/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.put(`appraisals/employee-hr-review/${hrReviewId}/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.put(`appraisals/all-hr-review/${hrReviewId}/`, formData);
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
        if (!rolePermissions.create) {
          toast.warning("You don't have permission to create.");
          return;
        }
        if(view?.isMyAppraisal){
          res = await api.post(`appraisals/my-hr-review/`, formData);
        } else if(view?.isReviewAppraisal){
          res = await api.post(`appraisals/employee-hr-review/`, formData);
        } else if(view?.isAllAppraisal){
          res = await api.post(`appraisals/all-hr-review/`, formData);
        } else {
          toast.warning("You dont have permission to perform this task.");
          return;
        }
        console.log("Create Response:", res?.data);
        if (res?.status === 201) {
          setHrReviewId(res?.data?.id);
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


  const salaryReview = [
    {title: "Promotion with Increment", value: "promo_with_increment_proposed_basic"},
    {title: "Promotion without Increment", value: "promo_without_increment_proposed_basic"},
    {title: "Increment", value: "increment_proposed_basic"},
    {title: "Pay Progression", value: "pp_proposed_basic"},
  ]


  const decisionsData = [
    {label: "Promotion Recommended with Increment", value: "promo_w_increment", valueRemarks: "promo_w_increment_remarks"},
    {label: "Promotion Recommended with PP only", value: "promo_w_pp", valueRemarks: "promo_w_pp_remarks"},
    {label: "Increment Recommended without Promotion", value: "increment_w_no_promo", valueRemarks: "increment_w_no_promo_remarks"},
    {label: "Only Pay Progression (PP) Recommended", value: "pp_only", valueRemarks: "pp_only_remarks"},
    {label: "Promotion/Increment/PP Deferred", value: "deferred", valueRemarks: "deferred_remarks"},
  ];

  const styles = {
    // NEW: Wrapper for the whole page to give it the grey background
    pageWrapper: {
      backgroundColor: "#f3f4f6", // Light grey background
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      width: "100%",
      backgroundColor: "#fff",
      color: "#333",
      padding: "24px", // Tweaked padding
      borderRadius: "8px",
      margin: "0 auto",
      maxWidth: "1100px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // Added shadow
    },
    section: {
      marginBottom: "24px", // Tweaked margin
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "24px", // Tweaked padding
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    heading: {
      fontSize: "16px", // Tweaked font size
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "12px",
    },
    smallNote: {
      fontSize: "12px",
      color: "#9ca3af",
    },
    textArea: {
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
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: 500,
      marginBottom: "5px",
      color: "#1f2937",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 10px",
      fontSize: "13.5px",
      color: "#374151",
      backgroundColor: "#fff",
      outline: "none",
      boxSizing: "border-box", // Added for better box model
    },
    inputReadOnly: {
      backgroundColor: "#f9fafb",
      color: "#6b7280",
    },
    grid: {
      display: "grid",
      gap: "18px",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    },
    // NEW: Specific 3-column grid for the top details section
    grid3col: {
      display: "grid",
      gap: "18px",
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    // NEW: Style for the grey info boxes in the details section
    infoBox: {
      backgroundColor: "#f3f4f6",
      padding: "8px 10px",
      borderRadius: "6px",
      fontSize: "13.5px",
      color: "#374151",
      minHeight: "38px",
      display: "flex",
      alignItems: "center",
    },
    // NEW: Tab container style
    tabContainer: {
      display: "flex",
      borderBottom: "1px solid #e5e7eb",
      marginBottom: "24px",
    },
    // NEW: Individual tab style
    tab: {
      padding: "10px 20px",
      fontSize: "14px",
      color: "#6b7280",
      cursor: "pointer",
      borderBottom: "2px solid transparent",
      marginBottom: "-1px",
    },
    // NEW: Active tab style
    tabActive: {
      color: "#2563eb",
      fontWeight: 600,
      borderBottom: "2px solid #2563eb",
    },
    subNote: {
      fontSize: "12.5px",
      color: "#6b7280",
      marginBottom: "12px",
    },
    blueText: {
      color: "#2563eb",
      fontWeight: 600,
      fontSize: "13.5px",
    },
    rowFlex: {
      display: "flex",
      alignItems: "center",
      gap: "30px",
    },
    // NEW: Style for the entire 'Decision' row (Label, Yes/No, Remarks)
    decisionRow: {
      display: "grid",
      gridTemplateColumns: "3fr 2fr 4fr", // Proportional columns
      gap: "16px",
      alignItems: "center",
      marginBottom: "16px",
    },
    // NEW: Style for the label in the 'Decision' row
    decisionLabel: {
      fontSize: "13px",
      color: "#374151",
      fontWeight: 500,
    },
    // Kept for consistency, but now holds radio buttons
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "25px",
    },
    // Updated to wrap radio buttons
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: "#374151",
    },
    // Note: The custom styles for checkbox are kept but unused
    // We are now using default radio buttons for correct functionality
    checkbox: {
      appearance: "none",
      width: "16px",
      height: "16px",
      border: "1px solid #9ca3af",
      borderRadius: "3px",
      cursor: "pointer",
      position: "relative",
      backgroundColor: "#fff",
    },
    checkboxChecked: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
    },
    // NEW: Style for the remarks input in the 'Decision' row
    decisionRemarks: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 10px",
      fontSize: "13.5px",
      color: "#374151",
      backgroundColor: "#fff",
      outline: "none",
      boxSizing: "border-box",
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
    buttonRow: {
      display: "flex",
      gap: "15px",
      marginTop: "20px",
    },
    btnPrimary: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "8px 22px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    btnSecondary: {
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      color: "#333",
      padding: "8px 22px",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <form style={styles.container} onSubmit={handleSubmit}>

        {/* Remarks from HR */}
        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Remarks from Human Resource</h2>
            <span style={styles.smallNote}>Maximum 1000 words</span>
          </div>
          <textarea
            style={styles.textArea}
            placeholder="Please validate this review and complement any necessary comment"
            name="remarks_hr"
            value={formData.remarks_hr || ''}
            onChange={handleChange}
            disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
            required
          ></textarea>
        </div>

        {/* Leave Details */}
        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Leave Details</h2>
            <span 
              style={styles.blueText}
            >
              Total Leave taken: {
                calculateTotalLeave(
                  formData.casual_leave_taken, 
                  formData.sick_leave_taken, 
                  formData.annual_leave_taken
                )
              }
            </span>
          </div>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Casual</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="casual_leave_taken"
                value={formData.casual_leave_taken || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required  
              />
            </div>
            <div>
              <label style={styles.label}>Sick</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="sick_leave_taken"
                value={formData.sick_leave_taken || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required   
              />
            </div>
            <div>
              <label style={styles.label}>Annual</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="annual_leave_taken"
                value={formData.annual_leave_taken || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required 
              />
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Attendance Details</h2>
            <span 
              style={styles.blueText}
            >
              Attendance Percentage: {
                calculateAttendancePercentage(
                  formData.on_time_count, 
                  formData.delay_count, 
                  formData.early_exit_count
                )
              }
            </span>
          </div>
          <p style={styles.subNote}>
            Very Good = 100–91%, Good = 81–90%, Average = 70–80%, Below Average = Less than 70%
          </p>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>On time</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="on_time_count"
                value={formData.on_time_count || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required 
              />
            </div>
            <div>
              <label style={styles.label}>Delay</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="delay_count"
                value={formData.delay_count || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required 
              />
            </div>
            <div>
              <label style={styles.label}>Early Exit</label>
              <input 
                type="number" 
                style={styles.input} 
                placeholder='Enter Number'
                name="early_exit_count"
                value={formData.early_exit_count || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                required  
              />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div style={styles.section}>
          {/* UPDATED: Heading changed to 'Salary Details' */}
          <h2 style={styles.heading}>Salary Details</h2>
          <div style={styles.rowFlex}>
            <p style={{ margin: 0 }}>
              <span style={{ ...styles.label, display: "inline", marginRight: "5px" }}>Basic Salary:</span>
              <span style={styles.blueText}>{formData.current_basic || 'XXXXX'}</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ ...styles.label, display: "inline", marginRight: "5px" }}>Gross Salary:</span>
              <span style={styles.blueText}>{calculateGross(formData?.current_basic, appraisalDetails?.factor) || 'XXXXX'}</span>
            </p>
          </div>
        </div>

        {/* Increment Sections */}
        {salaryReview.map((item) => (
          <div style={styles.section} key={item.title}>
            <h2 style={styles.heading}>{item.title}</h2>
            <div style={styles.grid3col}>
              {" "}
              {/* Using 3-col grid for consistency */}
              <div>
                <label style={styles.label}>Proposed Basic</label>
                <input 
                  type="number" 
                  style={styles.input} 
                  placeholder="Enter Amount"
                  name={item.value}
                  value={formData[item.value] || ''}
                  onChange={handleChange}
                  disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                  required  
                />
              </div>
              <div>
                <label style={styles.label}>Proposed Gross</label>
                <input 
                  type="text" 
                  style={{ ...styles.input, ...styles.inputReadOnly }} 
                  value={calculateGross(formData[item.value], appraisalDetails?.factor) || '0'} 
                  readOnly 
                />
              </div>
              <div>
                <label style={styles.label}>Gross Difference</label>
                <input 
                  type="text" 
                  style={{ ...styles.input, ...styles.inputReadOnly }} 
                  value={
                    calculateGrossDifference(
                      calculateGross(formData.current_basic, appraisalDetails?.factor), 
                      calculateGross(formData[item.value], appraisalDetails?.factor)
                    ) || '0'
                  }
                  readOnly 
                />
              </div>
            </div>
          </div>
        ))}

        {/* --- UPDATED: Decisions Section --- */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Decisions</h2>
          {decisionsData.map((item) => (
            <div key={item.label} style={styles.decisionRow}>
              <span style={styles.decisionLabel}>{item.label}</span>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  {/* Changed to radio button for correct functionality */}
                  <input
                    type="radio"
                    name={item.value} // Group radio buttons by name
                    onChange={() => setFormData(prev => ({ ...prev, [item.value]: true }))}
                    checked={formData[item.value] === true}
                    disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                  />{" "}
                  Yes
                </label>
                <label style={styles.checkboxLabel}>
                  {/* Changed to radio button for correct functionality */}
                  <input
                    type="radio"
                    name={item.value} // Group radio buttons by name
                    onChange={() => setFormData(prev => ({ ...prev, [item.value]: false }))}
                    checked={formData[item.value] === false}
                    disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
                  />{" "}
                  No
                </label>
              </div>
              <input 
                type="text" 
                style={styles.decisionRemarks} 
                placeholder="Remarks" 
                name={item.valueRemarks}
                value={formData[item.valueRemarks] || ''}
                onChange={handleChange}
                disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
              />
            </div>
          ))}

          <div style={{ marginTop: "30px" }}>
            <div style={styles.headerRow}>
              <label style={styles.label}>Remarks on your decision</label>
              <span style={styles.smallNote}>Maximum 500 words</span>
            </div>
            <textarea 
              style={styles.remarkBox} 
              placeholder="Please...."
              name="remarks_on_your_decision"
              value={formData.remarks_on_your_decision || ''}
              onChange={handleChange}
              disabled={hrReviewId ? !rolePermissions?.edit : !rolePermissions?.create}
            >
            </textarea>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          {(hrReviewId ? rolePermissions?.edit : rolePermissions?.create) && (
            <button
              type="submit"
              style={{...styles.btnPrimary, ...(isSubmitting && styles.buttonDisabled)}}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HrAppraisal;