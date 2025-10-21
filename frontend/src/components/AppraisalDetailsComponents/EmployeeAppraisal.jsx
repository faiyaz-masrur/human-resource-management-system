import React, { useState } from 'react';
// Axios is not used in this standalone example but would be in a real app
// import axios from 'axios'; 

const EmployeeAppraisal = ({ employeeId = '1001' }) => {
  const [formData, setFormData] = useState({
    achievements: '',
    training_needs_top: '',
    training_needs_bottom: '',
    training_description: '',
    soft_skills_training: true,
    business_training: true,
    technical_training: false,
  });

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Submitting appraisal for Employee ID: ${employeeId}`, formData);
      setMessage('Appraisal submitted successfully!');
      // Optionally reset form after submission
    } catch (error) {
      setIsError(true);
      setMessage('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage(null);
    setIsError(false);
    setFormData({
        achievements: '',
        training_needs_top: '',
        training_needs_bottom: '',
        training_description: '',
        soft_skills_training: false,
        business_training: false,
        technical_training: false,
    });
    console.log('Form reset.');
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
  const CustomCheckbox = ({ id, name, label, checked, onChange }) => (
    <label htmlFor={id} style={styles.checkboxItem}>
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={styles.checkboxInput}
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
        {message && (
          <div style={{...styles.messageContainer, ...(isError ? styles.errorMessage : styles.successMessage)}}>
            {message}
          </div>
        )}

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
            name="achievements"
            style={styles.textArea}
            placeholder="You are encouraged to provide details of your key achievements and contributions during the review period, with specific examples where possible."
            value={formData.achievements}
            onChange={handleChange}
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
            name="training_needs_top"
            style={styles.textArea}
            placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
            value={formData.training_needs_top}
            onChange={handleChange}
          />
        </div>

        {/* Training & Development Plan (Bottom - No Title) */}
        <div style={styles.formSection}>
          <textarea
            id="training_needs_bottom"
            name="training_needs_bottom"
            style={styles.textArea}
            placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
            value={formData.training_needs_bottom}
            onChange={handleChange}
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
              checked={formData.soft_skills_training}
              onChange={handleChange}
            />
            <CustomCheckbox
              id="business-training"
              name="business_training"
              label="Business Training"
              checked={formData.business_training}
              onChange={handleChange}
            />
            <CustomCheckbox
              id="technical-training"
              name="technical_training"
              label="Technical Training"
              checked={formData.technical_training}
              onChange={handleChange}
            />
          </div>
          <textarea
            id="training_description"
            name="training_description"
            style={styles.textArea}
            placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
            value={formData.training_description}
            onChange={handleChange}
          />
        </div>
        
        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{...styles.primaryButton, ...(isSubmitting && styles.buttonDisabled)}}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            style={{...styles.secondaryButton, ...(isSubmitting && styles.buttonDisabled)}}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAppraisal;

