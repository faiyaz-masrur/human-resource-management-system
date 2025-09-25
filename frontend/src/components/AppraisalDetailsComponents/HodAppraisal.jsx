import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HodAppraisal = ({ appraisalId }) => {
  // State to hold all appraisal data (employee, manager, HoD)
  const [appraisalData, setAppraisalData] = useState(null);
  // State for HoD-specific form data
  const [formData, setFormData] = useState({
    hod_remarks: '',
    final_decision: '',
    decision_remarks: '',
  });

  // State for UI feedback
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all appraisal data on component mount
  useEffect(() => {
    const fetchAppraisalData = async () => {
      if (!appraisalId) {
        setLoading(false);
        setIsError(true);
        setMessage("No appraisal ID provided.");
        return;
      }
      try {
        const response = await axios.get(`/api/appraisals/hod-review/${appraisalId}/`);
        setAppraisalData(response.data);
        // Initialize form data with existing HoD data if it exists
        if (response.data.hod_review) {
          const hodReview = response.data.hod_review;
          setFormData({
            hod_remarks: hodReview.hod_remarks || '',
            final_decision: hodReview.final_decision || '',
            decision_remarks: hodReview.decision_remarks || '',
          });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setIsError(true);
        setMessage("Failed to load appraisal data.");
        console.error("Error fetching appraisal data:", error);
      }
    };
    fetchAppraisalData();
  }, [appraisalId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle final decision radio button changes
  const handleDecisionChange = (e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      final_decision: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    
    // Check if a final decision is made
    if (!formData.final_decision) {
      setIsError(true);
      setMessage("Please select a final decision.");
      return;
    }

    try {
      const response = await axios.post(`/api/appraisals/hod-final-review/${appraisalId}/`, formData);
      if (response.status === 200) {
        setMessage('HoD review submitted successfully!');
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
    return <div className="appraisal-form-container text-center py-10 text-xl font-semibold">Loading appraisal data...</div>;
  }

  const { employee_appraisal, manager_review } = appraisalData;

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {/* Display messages */}
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {/* Employee and Manager Review Data */}
      <div className="form-section">
        <h2 className="section-title">Employee Self-Appraisal & Manager's Review</h2>
        {employee_appraisal && (
          <div className="appraisal-data-display mb-8">
            <h3 className="text-lg font-bold">Employee's Remarks:</h3>
            <p><strong>Achievements:</strong> {employee_appraisal.achievements}</p>
            <p><strong>Strengths:</strong> {employee_appraisal.strengths}</p>
            <p><strong>Improvements:</strong> {employee_appraisal.improvements}</p>
            <p><strong>Training Needs:</strong> {employee_appraisal.training_needs}</p>
          </div>
        )}
        {manager_review && (
          <div className="appraisal-data-display">
            <h3 className="text-lg font-bold">Manager's Remarks:</h3>
            <p><strong>Achievements Remarks:</strong> {manager_review.achievements_remarks}</p>
            <p><strong>Training Remarks:</strong> {manager_review.training_remarks}</p>
            <p><strong>Overall Rating:</strong> {manager_review.overall_performance_rating.replace(/_/g, ' ')}</p>
            <p><strong>Justification:</strong> {manager_review.justify_overall_rating}</p>
            <p><strong>Potential Rating:</strong> {manager_review.potential_rating.replace(/_/g, ' ')}</p>
            <p><strong>Decision Remarks:</strong> {manager_review.decision_remarks}</p>
          </div>
        )}
      </div>

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
          name="hod_remarks"
          className="form-textarea"
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
          value={formData.hod_remarks}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Decisions Section */}
      <div className="form-section">
        <label className="section-title">Decisions</label>
        <div className="decision-grid">
          <div className="decision-item">
            <label className="decision-label">Promotion Recommended with Increment</label>
            <input 
              type="radio" 
              name="final_decision" 
              value="promotion_increment"
              checked={formData.final_decision === 'promotion_increment'}
              onChange={handleDecisionChange}
            />
          </div>
          <div className="decision-item">
            <label className="decision-label">Promotion Recommended without Increment</label>
            <input 
              type="radio" 
              name="final_decision" 
              value="promotion_no_increment"
              checked={formData.final_decision === 'promotion_no_increment'}
              onChange={handleDecisionChange}
            />
          </div>
          <div className="decision-item">
            <label className="decision-label">Increment Recommended without Promotion</label>
            <input 
              type="radio" 
              name="final_decision" 
              value="increment_only"
              checked={formData.final_decision === 'increment_only'}
              onChange={handleDecisionChange}
            />
          </div>
          <div className="decision-item">
            <label className="decision-label">Only Pay Progression (PP) Recommended</label>
            <input 
              type="radio" 
              name="final_decision" 
              value="pp_only"
              checked={formData.final_decision === 'pp_only'}
              onChange={handleDecisionChange}
            />
          </div>
          <div className="decision-item">
            <label className="decision-label">Promotion/Increment/PP Deferred</label>
            <input 
              type="radio" 
              name="final_decision" 
              value="deferred"
              checked={formData.final_decision === 'deferred'}
              onChange={handleDecisionChange}
            />
          </div>
        </div>
        <div className="remarks-on-decision mt-8">
          <label className="input-label">Remarks on your decision</label>
          <span className="word-count-label">Maximum 500 words</span>
          <textarea
            className="form-textarea"
            name="decision_remarks"
            placeholder="Please provide comments to justify your decision..."
            rows="4"
            value={formData.decision_remarks}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="button-group">
        <button type="submit" className="submit-button">Submit</button>
        <button type="button" className="cancel-button">Cancel</button>
      </div>
    </form>
  );
};

export default HodAppraisal;
