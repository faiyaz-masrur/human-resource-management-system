import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const ReportingManagerAppraisal = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    achievements_remarks: '',
    training_remarks: '',
    justify_overall_rating: '',
    overall_performance_rating: '',
    potential_rating: '',
    decision_remarks: '',
  });

  const [employeeAppraisal, setEmployeeAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppraisalData = async () => {
      if (!employeeId) return;

      try {
        setLoading(true);
        const response = await api.get(`/appraisals/employee-appraisal/${employeeId}/rm/`);
        setEmployeeAppraisal(response.data.employee_appraisal);
        // Map RM fields if already present
        if (response.data.rm_review) {
          setFormData(response.data.rm_review);
        }
      } catch (err) {
        console.error('Error fetching appraisal data:', err);
        setIsError(true);
        setMessage('Failed to load appraisal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppraisalData();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      await api.post(`/review-appraisal/employee-appraisal/${employeeId}/rm/`, formData);
      setMessage('Manager review submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      setIsError(true);
      if (err.response) setMessage(err.response.data.error || 'Submission failed.');
      else setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage(null);
    setIsError(false);
    setFormData({
      achievements_remarks: '',
      training_remarks: '',
      justify_overall_rating: '',
      overall_performance_rating: '',
      potential_rating: '',
      decision_remarks: '',
    });
  };

  if (loading) return <div>Loading appraisal data...</div>;

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {employeeAppraisal && (
        <div className="form-section">
          <h2 className="section-title">Employee Self-Appraisal</h2>
          <div className="appraisal-data-display">
            <p><strong>Achievements:</strong> {employeeAppraisal.achievements}</p>
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

      {/* RM Form Sections */}
      <div className="form-section">
        <label className="section-title">Achievements/Goal Completion Remarks</label>
        <textarea
          name="achievements_remarks"
          className="form-textarea"
          value={formData.achievements_remarks}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <label className="section-title">Training & Development Remarks</label>
        <textarea
          name="training_remarks"
          className="form-textarea"
          value={formData.training_remarks}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <label className="section-title">Overall Performance Rating</label>
        <div className="radio-group-grid">
          {['does_not_meet','partially_meets','meets_expectation','meets_most_expectation','exceeds_expectation'].map((val) => (
            <div className="radio-item" key={val}>
              <input
                type="radio"
                name="overall_performance_rating"
                value={val}
                checked={formData.overall_performance_rating === val}
                onChange={handleChange}
              />
              <label className="radio-label">{val.replace(/_/g,' ')}</label>
            </div>
          ))}
        </div>
        <textarea
          name="justify_overall_rating"
          className="form-textarea"
          value={formData.justify_overall_rating}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <label className="section-title">Potential Rating</label>
        <div className="radio-group-stack">
          {['low_potential','medium_potential','high_potential'].map((val) => (
            <div className="radio-item" key={val}>
              <input
                type="radio"
                name="potential_rating"
                value={val}
                checked={formData.potential_rating === val}
                onChange={handleChange}
              />
              <label className="radio-label">{val.replace(/_/g,' ')}</label>
            </div>
          ))}
        </div>
        <textarea
          name="decision_remarks"
          className="form-textarea"
          value={formData.decision_remarks}
          onChange={handleChange}
        />
      </div>

      <div className="button-group">
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReportingManagerAppraisal;
