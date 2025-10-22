import React, { useState } from 'react';
// Axios would be used here in a real app, but is commented out for this example
// import axios from 'axios';

const ReportingManagerAppraisal = ({ appraisalId }) => {
  // Mock data for radio button groups to keep the code DRY
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

  const [formData, setFormData] = useState({
    achievements_remarks: '',
    training_remarks: '',
    justify_overall_rating: '',
    overall_performance_rating: 'does_not_meet', // Default checked value from screenshot
    potential_rating: 'low_potential', // Default checked value from screenshot
    decision_remarks: '',
  });

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Set to false as data fetching is removed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    setIsError(false);
    // Mock submission logic
    setTimeout(() => {
        setMessage('Manager review submitted successfully!');
        console.log("Form Data Submitted:", formData);
    }, 1000);
  };

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
    submitButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
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
  const CustomRadio = ({ id, name, value, label, checked, onChange }) => {
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
        />
        <label htmlFor={id} style={styles.radioLabel}>{label}</label>
      </div>
    );
  };


  if (loading) {
    return <div style={styles.pageWrapper}><div style={styles.container}>Loading...</div></div>;
  }

  return (
    <div style={styles.pageWrapper}>
      <form style={styles.container} onSubmit={handleSubmit}>
        {message && (
          <div style={{...styles.messageContainer, ...(isError ? styles.errorMessage : styles.successMessage)}}>
            {message}
          </div>
        )}
        
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
            placeholder="Make any comment that you feel necessary to clarify or supplement the achievements mentioned above, in addition to goals for next year."
            value={formData.achievements_remarks}
            onChange={handleChange}
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
            placeholder="Make any comment that you feel necessary..."
            value={formData.training_remarks}
            onChange={handleChange}
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
            value={formData.justify_overall_rating}
            onChange={handleChange}
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
                />
            ))}
          </div>
          <div style={{...styles.header, justifyContent: 'flex-end'}}>
              <span style={styles.wordCountLabel}>Maximum 500 words</span>
          </div>
          <textarea
            id="potential-comments"
            name="decision_remarks"
            style={styles.textArea}
            placeholder="Remarks on your decision..."
            value={formData.decision_remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
          <button type="button" style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportingManagerAppraisal;
