import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HrAppraisal = ({ appraisalId }) => {
  // State to hold all appraisal data (employee, manager, HR)
  const [appraisalData, setAppraisalData] = useState(null);
  // State for HR-specific form data
  const [formData, setFormData] = useState({
    hr_remarks: '',
    proposed_basic: '',
    proposed_gross: '',
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
        const response = await axios.get(`/api/appraisals/hr-review/${appraisalId}/`);
        setAppraisalData(response.data);
        // Initialize form data with existing HR data if it exists
        if (response.data.hr_review) {
          const hrReview = response.data.hr_review;
          setFormData({
            hr_remarks: hrReview.hr_remarks || '',
            proposed_basic: hrReview.proposed_basic || '',
            proposed_gross: hrReview.proposed_gross || '',
            final_decision: hrReview.final_decision || '',
            decision_remarks: hrReview.decision_remarks || '',
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

  // Handle salary input changes and calculate gross difference
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };
      const currentGross = appraisalData?.employee_salary?.gross_salary || 0;
      const proposedGross = parseFloat(updatedData.proposed_gross) || 0;
      const grossDifference = proposedGross - parseFloat(currentGross);
      updatedData.gross_difference = isNaN(grossDifference) ? 0 : grossDifference;
      return updatedData;
    });
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
      const response = await axios.post(`/api/appraisals/hr-final-review/${appraisalId}/`, formData);
      if (response.status === 200) {
        setMessage('HR review submitted successfully!');
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

  const { employee_appraisal, manager_review, employee_details, employee_salary, employee_leave } = appraisalData;

  const currentBasic = employee_salary?.basic_salary || 'N/A';
  const currentGross = employee_salary?.gross_salary || 'N/A';
  const totalLeave = (employee_leave?.sick_leave || 0) + (employee_leave?.annual_leave || 0) + (employee_leave?.other_leave || 0);

  // Calculate gross difference
  const grossDifference = (parseFloat(formData.proposed_gross) || 0) - (parseFloat(currentGross) || 0);

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
          <label htmlFor="hr-remarks" className="section-title">
            Remarks from Human Resource
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="hr-remarks"
          name="hr_remarks"
          className="form-textarea"
          placeholder="Please validate this review and complement any necessary comment"
          value={formData.hr_remarks}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Leave Details */}
      <div className="form-section">
        <div className="flex justify-between items-center mb-4">
          <label className="section-title">Leave Details</label>
          <span className="text-sm font-semibold text-gray-600">Total Leave taken: {totalLeave}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Annual</label>
            <input type="text" className="form-input" value={employee_leave?.annual_leave || 'N/A'} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Sick</label>
            <input type="text" className="form-input" value={employee_leave?.sick_leave || 'N/A'} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Other</label>
            <input type="text" className="form-input" value={employee_leave?.other_leave || 'N/A'} readOnly />
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
            <input type="text" className="form-input" value={employee_details?.on_time_days || 'N/A'} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Delay</label>
            <input type="text" className="form-input" value={employee_details?.delay_days || 'N/A'} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Early Exit</label>
            <input type="text" className="form-input" value={employee_details?.early_exit_days || 'N/A'} readOnly />
          </div>
        </div>
      </div>

      {/* Current and Proposed Salaries */}
      <div className="form-section">
        <label className="section-title">Current Salary</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Basic Salary</label>
            <input type="text" className="form-input" value={currentBasic} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Salary</label>
            <input type="text" className="form-input" value={currentGross} readOnly />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input type="text" className="form-input" value={0} readOnly />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="section-title">Proposed Salary</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-input-group">
            <label className="input-label">Proposed Basic</label>
            <input
              type="number"
              name="proposed_basic"
              className="form-input"
              placeholder="Enter Amount"
              value={formData.proposed_basic}
              onChange={handleSalaryChange}
            />
          </div>
          <div className="form-input-group">
            <label className="input-label">Proposed Gross</label>
            <input
              type="number"
              name="proposed_gross"
              className="form-input"
              placeholder="Enter Amount"
              value={formData.proposed_gross}
              onChange={handleSalaryChange}
            />
          </div>
          <div className="form-input-group">
            <label className="input-label">Gross Difference</label>
            <input
              type="text"
              className="form-input"
              value={grossDifference.toFixed(2)}
              readOnly
            />
          </div>
        </div>
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

export default HrAppraisal;
