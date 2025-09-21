import React from 'react';

const EmployeeAppraisal = () => {
  return (
    <div className="appraisal-form-container">
      {/* Achievements/Goal Completion Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="achievements" className="section-title">
            Achievements/Goal Completion
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="achievements"
          className="form-textarea"
          placeholder="You are encouraged to..."
        ></textarea>
      </div>

      {/* Training & Development Plan Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="training-plan" className="section-title">
            Training & Development Plan
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="training-plan"
          className="form-textarea"
          placeholder="What do you consider..."
        ></textarea>
      </div>
      
      {/* Further Training Section */}
      <div className="form-section">
        <label className="section-title mb-4">
          What further training and/or experience do you feel would help your future performance and development?
        </label>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input type="checkbox" id="soft-skills" name="training" className="form-checkbox" />
            <label htmlFor="soft-skills" className="checkbox-label">Soft Skills Training</label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="business-training" name="training" className="form-checkbox" />
            <label htmlFor="business-training" className="checkbox-label">Business Training</label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="technical-training" name="training" className="form-checkbox" />
            <label htmlFor="technical-training" className="checkbox-label">Technical Training</label>
          </div>
        </div>
        <div className="form-header">
          <label htmlFor="further-training" className="hidden"></label>
          <span className="word-count-label">Maximum 500 words</span>
        </div>
        <textarea
          id="further-training"
          className="form-textarea"
          placeholder="What do you consider..."
        ></textarea>
      </div>
      
      {/* Buttons Section */}
      <div className="button-group">
        <button className="submit-button">
          Submit
        </button>
        <button className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmployeeAppraisal;
