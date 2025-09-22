import React from 'react';

const ReportingManagerAppraisal = () => {
  return (
    <div className="appraisal-form-container">
      {/* Achievements/Goal Completion Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="rm-achievements" className="section-title">
            Achievements/Goal Completion
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="rm-achievements"
          className="form-textarea"
          placeholder="Make any comment that you feel necessary to clarify or supplement the achievements mentioned above, in addition to goals for next year."
        ></textarea>
      </div>

      {/* Training & Development Plan Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="rm-training" className="section-title">
            Reporting Manager's remarks for Training and Development Plan
          </label>
          <span className="word-count-label hidden">Maximum 1000 words</span>
        </div>
        <textarea
          id="rm-training"
          className="form-textarea"
          placeholder="Make any comment that you feel necessary..."
        ></textarea>
      </div>

      {/* Overall Assessment Section */}
      <div className="form-section">
        <label className="section-title mb-4">
          Overall Assessment
        </label>
        <p className="section-description">
          How are you going to rate an employee's overall performance in terms of meeting or exceeding performance expectations? Select the option that best reflects the employee's level of performance over time.
        </p>
        <div className="radio-group-grid">
          <div className="radio-item">
            <input type="radio" id="performance-1" name="overall-performance" className="form-radio" />
            <label htmlFor="performance-1" className="radio-label">Does not meet expectation</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="performance-2" name="overall-performance" className="form-radio" />
            <label htmlFor="performance-2" className="radio-label">Partially meets expectation</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="performance-3" name="overall-performance" className="form-radio" />
            <label htmlFor="performance-3" className="radio-label">Meets expectation</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="performance-4" name="overall-performance" className="form-radio" />
            <label htmlFor="performance-4" className="radio-label">Meets most expectation</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="performance-5" name="overall-performance" className="form-radio" />
            <label htmlFor="performance-5" className="radio-label">Exceeds Expectation</label>
          </div>
        </div>
        <p className="word-count-label">Maximum 500 words</p>
        <textarea
          id="performance-comments"
          className="form-textarea"
          placeholder="Provide comments to justify your rating..."
        ></textarea>
      </div>

      {/* Potential Rating Section */}
      <div className="form-section">
        <label className="section-title mb-4">
          How are you going to rate an employee's overall performance in terms of meeting or exceeding performance expectations? Select the option that best reflects the employee's level of performance over time.
        </label>
        <div className="radio-group-stack">
          <div className="radio-item">
            <input type="radio" id="potential-1" name="potential-rating" className="form-radio" />
            <label htmlFor="potential-1" className="radio-label">Low Potential - improvement not expected; lack of ability and/or motivation.</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="potential-2" name="potential-rating" className="form-radio" />
            <label htmlFor="potential-2" className="radio-label">Medium potential - room for some advancement in terms of performance or expertise.</label>
          </div>
          <div className="radio-item">
            <input type="radio" id="potential-3" name="potential-rating" className="form-radio" />
            <label htmlFor="potential-3" className="radio-label">High potential - performing well and ready for promotion immediately.</label>
          </div>
        </div>
        <p className="word-count-label">Maximum 1000 words</p>
        <textarea
          id="potential-comments"
          className="form-textarea"
          placeholder="Remarks on your decision..."
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

export default ReportingManagerAppraisal;
