import React from "react";

const HrAppraisal = () => {
  // Data for the 'Decisions' section, based on the screenshot's checked states
  const decisionsData = [
    { label: "Promotion Recommended with Increment", defaultYes: true },
    { label: "Promotion Recommended with PP only", defaultYes: false },
    { label: "Increment Recommended without Promotion", defaultYes: true },
    { label: "Only Pay Progression (PP) Recommended", defaultYes: false },
    { label: "Promotion/Increment/PP Deferred", defaultYes: true },
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
      height: "110px",
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
      <div style={styles.container}>

        {/* Remarks from HR */}
        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Remarks from Human Resource</h2>
            <span style={styles.smallNote}>Maximum 1000 words</span>
          </div>
          <textarea
            style={styles.textArea}
            placeholder="Please validate this review and complement any necessary comment"
          ></textarea>
        </div>

        {/* Leave Details */}
        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Leave Details</h2>
            <span style={styles.blueText}>Total Leave taken: 19</span>
          </div>
          <div style={styles.grid}>
            <div>
              {/* UPDATED: Label changed to 'Annual' */}
              <label style={styles.label}>Annual</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="5" readOnly />
            </div>
            <div>
              <label style={styles.label}>Sick</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="7" readOnly />
            </div>
            <div>
              {/* UPDATED: Label changed to 'Sick' */}
              <label style={styles.label}>Sick</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="7" readOnly />
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Attendance Details</h2>
          <p style={styles.subNote}>
            Very Good = 100–91%, Good = 81–90%, Average = 70–80%, Below Average = Less than 70%
          </p>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>On time</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="189" readOnly />
            </div>
            <div>
              <label style={styles.label}>Delay</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="29" readOnly />
            </div>
            <div>
              <label style={styles.label}>Early Exit</label>
              <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="7" readOnly />
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
              <span style={styles.blueText}>XXXXX</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ ...styles.label, display: "inline", marginRight: "5px" }}>Gross Salary:</span>
              <span style={styles.blueText}>XXXXX</span>
            </p>
          </div>
        </div>

        {/* Increment Sections */}
        {["Promotion with Increment", "Promotion without Increment", "Increment", "Pay Progression"].map((title) => (
          <div style={styles.section} key={title}>
            <h2 style={styles.heading}>{title}</h2>
            <div style={styles.grid3col}>
              {" "}
              {/* Using 3-col grid for consistency */}
              <div>
                <label style={styles.label}>Proposed Basic</label>
                <input type="text" style={styles.input} placeholder="Enter Amount" />
              </div>
              <div>
                <label style={styles.label}>Proposed Gross</label>
                <input type="text" style={styles.input} placeholder="Enter Amount" />
              </div>
              <div>
                <label style={styles.label}>Gross Difference</label>
                <input type="text" style={{ ...styles.input, ...styles.inputReadOnly }} defaultValue="0" readOnly />
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
                    name={item.label} // Group radio buttons by name
                    defaultChecked={item.defaultYes}
                  />{" "}
                  Yes
                </label>
                <label style={styles.checkboxLabel}>
                  {/* Changed to radio button for correct functionality */}
                  <input
                    type="radio"
                    name={item.label} // Group radio buttons by name
                    defaultChecked={!item.defaultYes}
                  />{" "}
                  No
                </label>
              </div>
              <input type="text" style={styles.decisionRemarks} placeholder="Remarks" />
            </div>
          ))}

          <div style={{ marginTop: "30px" }}>
            <div style={styles.headerRow}>
              <label style={styles.label}>Remarks on your decision</label>
              <span style={styles.smallNote}>Maximum 500 words</span>
            </div>
            <textarea style={styles.remarkBox} placeholder="Please..."></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button style={styles.btnPrimary}>Submit</button>
          <button style={styles.btnSecondary}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default HrAppraisal;