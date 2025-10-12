import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportingManagerAppraisal = ({ appraisalId }) => {
  // State for form data
  const [formData, setFormData] = useState({
    achievements_remarks: '',
    training_remarks: '',
    justify_overall_rating: '',
    overall_performance_rating: '',
    potential_rating: '',
    decision_remarks: '',
  });

  // State to hold employee's self-appraisal data for display
  const [employeeAppraisal, setEmployeeAppraisal] = useState(null);

  // State for UI feedback
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAppraisalData = async () => {
      if (!appraisalId) {
        setLoading(false);
        setIsError(true);
        //setMessage("No appraisal ID provided.");
        return;
      }

      try {
        const response = await axios.get(`/api/appraisals/history/${appraisalId}/`);
        setEmployeeAppraisal(response.data.employee_appraisal);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setIsError(true);
        setMessage("Failed to load employee appraisal data.");
        console.error("Error fetching appraisal data:", error);
      }
    };
    fetchAppraisalData();
  }, [appraisalId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const response = await axios.post(`/api/appraisals/manager-review/${appraisalId}/`, formData);
      if (response.status === 200) {
        setMessage('Manager review submitted successfully!');
      } else {
        setIsError(true);
        setMessage('Failed to submit review. Please try again.');
      }
    } catch (error) {
      setIsError(true);
      if (error.response) {
        setMessage(error.response.data.error || 'An error occurred during submission.');
      } else if (error.request) {
        setMessage('No response from server. Please check your network connection.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="appraisal-form-container">Loading...</div>;
  }

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {/* Display messages */}
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {/* Employee's Self-Appraisal Data */}
      {employeeAppraisal && (
        <div className="form-section">
          <h2 className="section-title">Employee Self-Appraisal</h2>
          <div className="appraisal-data-display">
            <p><strong>Achievements:</strong> {employeeAppraisal.achievements}</p>
            <p><strong>Strengths:</strong> {employeeAppraisal.strengths}</p>
            <p><strong>Areas for Improvement:</strong> {employeeAppraisal.improvements}</p>
            <p><strong>Training Needs:</strong> {employeeAppraisal.training_needs}</p>
            <p><strong>Training Type:</strong></p>
            <ul>
              {employeeAppraisal.soft_skills_training && <li>Soft Skills Training</li>}
              {employeeAppraisal.business_training && <li>Business Training</li>}
              {employeeAppraisal.technical_training && <li>Technical Training</li>}
            </ul>
          </div>
        </div>
      )}

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
          name="achievements_remarks"
          className="form-textarea"
          placeholder="Make any comment that you feel necessary to clarify or supplement the achievements mentioned above, in addition to goals for next year."
          value={formData.achievements_remarks}
          onChange={handleChange}
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
          name="training_remarks"
          className="form-textarea"
          placeholder="Make any comment that you feel necessary..."
          value={formData.training_remarks}
          onChange={handleChange}
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
            <input 
              type="radio" 
              id="performance-1" 
              name="overall_performance_rating" 
              className="form-radio" 
              value="does_not_meet"
              checked={formData.overall_performance_rating === 'does_not_meet'}
              onChange={handleChange}
            />
            <label htmlFor="performance-1" className="radio-label">Does not meet expectation</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="performance-2" 
              name="overall_performance_rating" 
              className="form-radio"
              value="partially_meets"
              checked={formData.overall_performance_rating === 'partially_meets'}
              onChange={handleChange}
            />
            <label htmlFor="performance-2" className="radio-label">Partially meets expectation</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="performance-3" 
              name="overall_performance_rating" 
              className="form-radio" 
              value="meets_expectation"
              checked={formData.overall_performance_rating === 'meets_expectation'}
              onChange={handleChange}
            />
            <label htmlFor="performance-3" className="radio-label">Meets expectation</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="performance-4" 
              name="overall_performance_rating" 
              className="form-radio" 
              value="meets_most_expectation"
              checked={formData.overall_performance_rating === 'meets_most_expectation'}
              onChange={handleChange}
            />
            <label htmlFor="performance-4" className="radio-label">Meets most expectation</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="performance-5" 
              name="overall_performance_rating" 
              className="form-radio" 
              value="exceeds_expectation"
              checked={formData.overall_performance_rating === 'exceeds_expectation'}
              onChange={handleChange}
            />
            <label htmlFor="performance-5" className="radio-label">Exceeds Expectation</label>
          </div>
        </div>
        <p className="word-count-label">Maximum 1000 words</p>
        <textarea
          id="performance-comments"
          name="justify_overall_rating"
          className="form-textarea"
          placeholder="Provide comments to justify your rating..."
          value={formData.justify_overall_rating}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Potential Rating Section */}
      <div className="form-section">
        <label className="section-title mb-4">
          How are you going to rate an employee's potential? Select the option that best reflects the employee's level of performance over time.
        </label>
        <div className="radio-group-stack">
          <div className="radio-item">
            <input 
              type="radio" 
              id="potential-1" 
              name="potential_rating" 
              className="form-radio" 
              value="low_potential"
              checked={formData.potential_rating === 'low_potential'}
              onChange={handleChange}
            />
            <label htmlFor="potential-1" className="radio-label">Low Potential - improvement not expected; lack of ability and/or motivation.</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="potential-2" 
              name="potential_rating" 
              className="form-radio" 
              value="medium_potential"
              checked={formData.potential_rating === 'medium_potential'}
              onChange={handleChange}
            />
            <label htmlFor="potential-2" className="radio-label">Medium potential - room for some advancement in terms of performance or expertise.</label>
          </div>
          <div className="radio-item">
            <input 
              type="radio" 
              id="potential-3" 
              name="potential_rating" 
              className="form-radio" 
              value="high_potential"
              checked={formData.potential_rating === 'high_potential'}
              onChange={handleChange}
            />
            <label htmlFor="potential-3" className="radio-label">High potential - performing well and ready for promotion immediately.</label>
          </div>
        </div>
        <p className="word-count-label">Maximum 500 words</p>
        <textarea
          id="potential-comments"
          name="decision_remarks"
          className="form-textarea"
          placeholder="Remarks on your decision..."
          value={formData.decision_remarks}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Buttons Section */}
      <div className="button-group">
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button type="button" className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReportingManagerAppraisal;
