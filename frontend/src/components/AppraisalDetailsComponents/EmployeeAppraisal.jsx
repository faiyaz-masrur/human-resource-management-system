import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const EmployeeAppraisal = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    achievements: '',
    training_needs_top: '',
    training_needs_bottom: '',
    training_description: '',
    soft_skills_training: false,
    business_training: false,
    technical_training: false,
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAppraisal = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/appraisals/employee-appraisal/${employeeId}/`);
        const data = response.data;
  
        setFormData({
          achievements: data.achievements || '',
          training_needs_top: data.training_needs_top || '',
          training_needs_bottom: data.training_needs_bottom || '',
          training_description: data.training_description || '',
          soft_skills_training: data.soft_skills_training ?? false,
          business_training: data.business_training ?? false,
          technical_training: data.technical_training ?? false,
        });
      } catch (err) {
        console.error('Failed to fetch appraisal data:', err);
        setMessage('Failed to load appraisal data.');
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchAppraisal();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await api.post(`/my-appraisal/${employeeId}/`, formData);
      setMessage('Appraisal submitted successfully!');
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setMessage('Failed to submit appraisal. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage(null);
    setIsError(false);
  
    setFormData({
      achievements: '',
      training_needs_top: '',
      training_needs_bottom: '',
      training_description: '',
      soft_skills_training: false,
      business_training: false,
      technical_training: false,
    });
  };

  if (loading) return <div>Loading appraisal data...</div>;

  return (
    <div className="appraisal-page">
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}
      <form className="appraisal-form-container" onSubmit={handleSubmit}>
  
        <div className="form-section">
          <label className="section-title">Achievements / Goal Completion</label>
          <textarea
            name="achievements"
            className="form-textarea"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="Your key achievements..."
            required
          />
        </div>

        <div className="form-section">
          <label className="section-title">Training & Development Plan</label>
          <textarea
            name="training_needs_top"
            className="form-textarea"
            value={formData.training_needs_top}
            onChange={handleChange}
            placeholder="Your development goals..."
          />
          <textarea
            name="training_needs_bottom"
            className="form-textarea"
            value={formData.training_needs_bottom}
            onChange={handleChange}
            placeholder="Additional development goals..."
          />
        </div>

        <div className="form-section">
          <label className="section-title">Further Training Needed</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="soft_skills_training"
                checked={formData.soft_skills_training}
                onChange={handleChange}
              />
              <label>Soft Skills Training</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="business_training"
                checked={formData.business_training}
                onChange={handleChange}
              />
              <label>Business Training</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="technical_training"
                checked={formData.technical_training}
                onChange={handleChange}
              />
              <label>Technical Training</label>
            </div>
          </div>
          <textarea
            name="training_description"
            className="form-textarea"
            value={formData.training_description}
            onChange={handleChange}
            placeholder="Additional comments on training needs..."
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button">Download Appraisal</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAppraisal;
