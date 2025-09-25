import React, { useState } from 'react';
import axios from 'axios';

const EmployeeAppraisal = () => {
  // State for form data
  const [formData, setFormData] = useState({
    achievements: '',
    strengths: '',
    improvements: '',
    training_needs: '',
    soft_skills_training: false,
    business_training: false,
    technical_training: false,
  });

  // State for UI feedback
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsError(false);

    try {
      const response = await axios.post('/api/appraisals/self-appraisal/', formData);
      if (response.status === 201) {
        setMessage('Appraisal submitted successfully!');
      } else {
        // This block might not be hit if a non-2xx status throws an error
        setIsError(true);
        setMessage('Failed to submit appraisal. Please try again.');
      }
    } catch (error) {
      setIsError(true);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(error.response.data.error || 'An error occurred during submission.');
      } else if (error.request) {
        // The request was made but no response was received
        setMessage('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {/* Display messages */}
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

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
          name="achievements"
          className="form-textarea"
          placeholder="You are encouraged to provide details of your key achievements and contributions during the review period, with specific examples where possible."
          value={formData.achievements}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Strengths Section - Added to match backend model */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="strengths" className="section-title">
            Your Strengths
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="strengths"
          name="strengths"
          className="form-textarea"
          placeholder="What do you believe are your main strengths? How do you think you can utilize these for the company's benefit?"
          value={formData.strengths}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Improvements Section - Added to match backend model */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="improvements" className="section-title">
            Areas for Improvement
          </label>
          <span className="word-count-label">Maximum 1000 words</span>
        </div>
        <textarea
          id="improvements"
          name="improvements"
          className="form-textarea"
          placeholder="What areas do you feel you need to improve upon? What challenges did you face and how did you overcome them?"
          value={formData.improvements}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Training & Development Plan Section */}
      <div className="form-section">
        <div className="form-header">
          <label htmlFor="training_needs" className="section-title">
            Training & Development Plan
          </label>
          <span className="word-count-label">Maximum 500 words</span>
        </div>
        <textarea
          id="training_needs"
          name="training_needs"
          className="form-textarea"
          placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
          value={formData.training_needs}
          onChange={handleChange}
        ></textarea>
      </div>
      
      {/* Further Training Section */}
      <div className="form-section">
        <label className="section-title mb-4">
          What further training and/or experience do you feel would help your future performance and development?
        </label>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="soft-skills" 
              name="soft_skills_training" 
              className="form-checkbox" 
              checked={formData.soft_skills_training}
              onChange={handleChange}
            />
            <label htmlFor="soft-skills" className="checkbox-label">Soft Skills Training</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="business-training" 
              name="business_training" 
              className="form-checkbox" 
              checked={formData.business_training}
              onChange={handleChange}
            />
            <label htmlFor="business-training" className="checkbox-label">Business Training</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="technical-training" 
              name="technical_training" 
              className="form-checkbox" 
              checked={formData.technical_training}
              onChange={handleChange}
            />
            <label htmlFor="technical-training" className="checkbox-label">Technical Training</label>
          </div>
        </div>
      </div>
      
      {/* Buttons Section */}
      <div className="button-group">
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button type="button" className="cancel-button" onClick={() => console.log('Cancel button clicked')}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeAppraisal;
