import React from 'react';

const HodAppraisal = () => {
  return (
    <div className="appraisal-form-container">
      {/* Remarks Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="hod-remarks" className="section-title">
            Remarks
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="hod-remarks"
          className="form-textarea"
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
        ></textarea>
      </div>

      {/* Decisions Section */}
      <div className="form-section">
        <label className="section-title">Decisions</label>
        <div className="decision-grid">
          <div className="decision-item">
            <label className="decision-label">Promotion Recommended with Increment</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">No</label>
              </div>
            </div>
            <input type="text" className="decision-input" placeholder="Remarks" />
          </div>

          <div className="decision-item">
            <label className="decision-label">Promotion Recommended with PP only</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">No</label>
              </div>
            </div>
            <input type="text" className="decision-input" placeholder="Remarks" />
          </div>

          <div className="decision-item">
            <label className="decision-label">Increment Recommended without Promotion</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">No</label>
              </div>
            </div>
            <input type="text" className="decision-input" placeholder="Remarks" />
          </div>

          <div className="decision-item">
            <label className="decision-label">Only Pay Progression (PP) Recommended</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">No</label>
              </div>
            </div>
            <input type="text" className="decision-input" placeholder="Remarks" />
          </div>

          <div className="decision-item">
            <label className="decision-label">Promotion/Increment/PP Deferred</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">Yes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <label className="ml-2">No</label>
              </div>
            </div>
            <input type="text" className="decision-input" placeholder="Remarks" />
          </div>
        </div>

        <div className="remarks-on-decision mt-8">
          <label className="input-label">Remarks on your decision</label>
          <span className="word-count-label">Maximum 500 words</span>
          <textarea className="form-textarea" placeholder="Please...." rows="4"></textarea>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="button-group">
        <button className="submit-button">Submit</button>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default HodAppraisal;
