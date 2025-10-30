import React from "react";

const HodAppraisal = () => {
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
      minHeight: "100px",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      padding: "12px 14px",
      fontSize: "14px",
      resize: "vertical",
      outline: "none",
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
    cancelButton: {
      backgroundColor: "#fff",
      color: "#333",
      padding: "8px 24px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  // Small helper for white styled checkbox behavior
  const WhiteCheckbox = () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <span
        style={{
          ...styles.checkbox,
          ...(checked ? styles.checkboxChecked : {}),
        }}
        onClick={() => setChecked(!checked)}
      >
        {checked && (
          <span
            style={{
              position: "absolute",
              top: "1px",
              left: "4px",
              width: "4px",
              height: "8px",
              border: "solid #fff",
              borderWidth: "0 2px 2px 0",
              transform: "rotate(45deg)",
            }}
          />
        )}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Remarks Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <label style={styles.sectionTitle}>Remarks</label>
          <span style={styles.wordCount}>Maximum 1000 words</span>
        </div>
        <textarea
          style={styles.textarea}
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
        ></textarea>
      </div>

      {/* Decisions Section */}
      <div style={styles.section}>
        <label style={styles.sectionTitle}>Decisions</label>
        <div style={styles.decisionGrid}>
          {[
            "Promotion Recommended with Increment",
            "Promotion Recommended with PP only",
            "Increment Recommended without Promotion",
            "Only Pay Progression (PP) Recommended",
            "Promotion/Increment/PP Deferred",
          ].map((label, i) => (
            <div style={styles.decisionItem} key={i}>
              <label style={styles.decisionLabel}>{label}</label>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <WhiteCheckbox /> Yes
                </label>
                <label style={styles.checkboxLabel}>
                  <WhiteCheckbox /> No
                </label>
              </div>
              <input type="text" style={styles.input} placeholder="Remarks" />
            </div>
          ))}
        </div>

        {/* Remarks on Decision */}
        <div style={styles.remarksSection}>
          <div style={styles.sectionHeader}>
            <label style={styles.sectionTitle}>Remarks on your decision</label>
            <span style={styles.wordCount}>Maximum 500 words</span>
          </div>
          <textarea
            style={styles.textarea}
            placeholder="Please....."
            rows="4"
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button style={styles.submitButton}>Submit</button>
        <button style={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

export default HodAppraisal;
