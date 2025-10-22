import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CeoAppraisal = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    remarks: '',
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

  const decisionKeys = ['promo_inc', 'promo_pp', 'inc_only', 'pp_only', 'deferred'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/appraisals/employee-appraisal/${employeeId}/ceo`);
        if (response.data) setFormData(response.data);
      } catch (err) {
        console.error('Error fetching CEO appraisal:', err);
        setIsError(true);
        setMessage('Failed to load appraisal data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const handleChange = (e) => {
    const { type, checked, value, dataset } = e.target;
    if (dataset.decision) {
      setFormData((prev) => ({
        ...prev,
        decisions: {
          ...prev.decisions,
          [dataset.decision]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, remarks: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      await api.post(`/appraisals/ceo-review/${employeeId}/`, formData);
      setMessage('CEO review submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      setIsError(true);
      setMessage(err.response?.data?.error || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      remarks: '',
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

  if (loading) return <div>Loading CEO appraisal...</div>;

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {/* Remarks */}
      <div className="form-section">
        <label htmlFor="ceo-remarks" className="section-title">Remarks</label>
        <span className="word-count-label">Maximum 1000 words</span>
        <textarea
          id="ceo-remarks"
          className="form-textarea"
          placeholder="Please confirm your agreement to this review and add any comment you feel necessary."
          value={formData.remarks}
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
                    checked={formData.decisions[key] === true}
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
                        decisions: { ...prev.decisions, [key]: false },
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
            placeholder="Additional remarks..."
            rows="4"
            value={formData.decisions.remarks}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
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

export default CeoAppraisal;
