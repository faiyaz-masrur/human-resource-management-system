import React from 'react';

const HrAppraisal = () => {
  return (
    <div className="appraisal-form-container">
      {/* Remarks Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="hr-remarks" className="section-title">
            Remarks from Human Resource
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="hr-remarks"
          className="form-textarea"
          placeholder="Please validate this review and complement any necessary comment"
        ></textarea>
      </div>

      {/* Leave Details */}
      <div className="form-section">
        <div className="flex justify-between items-center mb-4">
          <label className="section-title">Leave Details</label>
          <span className="text-sm font-semibold text-gray-600">Total Leave taken: 19</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Annual</label>
            <input type="text" className="form-input" placeholder="5" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Sick</label>
            <input type="text" className="form-input" placeholder="5" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Sick</label>
            <input type="text" className="form-input" placeholder="7" readOnly />
          </div>
        </div>
      </div>

      {/* Attendance Details */}
      <div className="form-section">
        <label className="section-title">Attendance Details</label>
        <p className="text-sm text-gray-600 mb-4">
          Very Good:100-91%, Good:81-90%, Average:70-80%, Below Average:Less than 70%
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">On time</label>
            <input type="text" className="form-input" placeholder="189" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Delay</label>
            <input type="text" className="form-input" placeholder="29" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Early Exit</label>
            <input type="text" className="form-input" placeholder="7" readOnly />
          </div>
        </div>
      </div>

      {/* Leave Details (again, based on the image) */}
      <div className="form-section">
        <label className="section-title">Leave Details</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Basic Salary</label>
            <input type="text" className="form-input" placeholder="XXXXX" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Salary</label>
            <input type="text" className="form-input" placeholder="XXXXX" readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" placeholder="0" readOnly />
          </div>
        </div>
      </div>

      {/* Promotion and Increment Sections */}
      <div className="form-section">
        <label className="section-title">Promotion with Increment</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Proposed Basic</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Proposed Gross</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" placeholder="0" readOnly />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="section-title">Promotion without Increment</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Proposed Basic</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Proposed Gross</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" placeholder="0" readOnly />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="section-title">Increment</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Proposed Basic</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Proposed Gross</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" placeholder="0" readOnly />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="section-title">Pay Progression</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Proposed Basic</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Proposed Gross</label>
            <input type="text" className="form-input" placeholder="Enter Amount" />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" placeholder="0" readOnly />
          </div>
        </div>
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

export default HrAppraisal;
