import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const HodAppraisal = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    hod_remarks: '',
    decisions: {
      promo_inc: null,
      promo_pp: null,
      inc_only: null,
      pp_only: null,
      deferred: null,
      remarks: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;

      try {
        setLoading(true);
        const response = await api.get(`/appraisals/employee-appraisal/${employeeId}/hod/`);
        if (response.data.hod_review) {
          setFormData(response.data.hod_review);
        }
      } catch (err) {
        console.error('Error fetching HOD appraisal:', err);
        setIsError(true);
        setMessage('Failed to load HOD appraisal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleChange = (e) => {
    const { type, checked, name, value, dataset } = e.target;

    if (dataset.decision) {
      setFormData((prev) => ({
        ...prev,
        decisions: {
          ...prev.decisions,
          [dataset.decision]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      await api.post(`/review-appraisal/employee-appraisal/${employeeId}/hod/`, formData);
      setMessage('HOD review submitted successfully!');
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
    setFormData({
      hod_remarks: '',
      decisions: {
        promo_inc: null,
        promo_pp: null,
        inc_only: null,
        pp_only: null,
        deferred: null,
        remarks: '',
      },
    });
    setMessage(null);
    setIsError(false);
  };

  if (loading) return <div>Loading HOD appraisal...</div>;

  const decisionKeys = ['promo_inc', 'promo_pp', 'inc_only', 'pp_only', 'deferred'];

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {/* HOD Remarks */}
      <div className="form-section">
        <label className="section-title">Remarks</label>
        <textarea
          name="hod_remarks"
          className="form-textarea"
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
          value={formData.hod_remarks}
          onChange={handleChange}
        />
      </div>

      {/* Decisions */}
      <div className="form-section">
        <label className="section-title">Decisions</label>
        <div className="decision-grid">
          {decisionKeys.map((key) => (
            <div key={key} className="decision-item">
              <label className="decision-label">{key.replace(/_/g, ' ')}</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!formData.decisions[key]}
                    data-decision={key}
                    onChange={handleChange}
                  />
                  <label className="ml-2">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.decisions[key] === false}
                    data-decision={key}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        decisions: {
                          ...prev.decisions,
                          [key]: false,
                        },
                      }))
                    }
                  />
                  <label className="ml-2">No</label>
                </div>
              </div>
              <input
                type="text"
                className="decision-input"
                data-decision={key}
                placeholder="Remarks"
                value={formData.decisions[key] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="remarks-on-decision mt-8">
          <label className="input-label">Remarks on your decision</label>
          <span className="word-count-label">Maximum 500 words</span>
          <textarea
            className="form-textarea"
            data-decision="remarks"
            placeholder="Please...."
            rows="4"
            value={formData.decisions.remarks}
            onChange={handleChange}
          ></textarea>
        </div>
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

export default HodAppraisal;
