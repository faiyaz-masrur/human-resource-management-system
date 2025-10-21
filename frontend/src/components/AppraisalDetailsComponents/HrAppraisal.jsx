import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const HrAppraisal = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    hr_remarks: '',
    proposed_basic_inc: '',
    proposed_gross_inc: '',
    proposed_basic_pp: '',
    proposed_gross_pp: '',
    decisions: {
      promo_inc: null,
      promo_pp: null,
      inc_only: null,
      pp_only: null,
      deferred: null,
      remarks: '',
    },
  });

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;

      try {
        setLoading(true);
        const response = await api.get(`/appraisals/employee-appraisal/${employeeId}/hr/`);
        setEmployeeData(response.data.employee_appraisal);

        if (response.data.hr_review) {
          setFormData(response.data.hr_review);
        }
      } catch (err) {
        console.error('Error fetching HR appraisal:', err);
        setIsError(true);
        setMessage('Failed to load HR appraisal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;

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
      await api.post(`/review-appraisal/employee-appraisal/${employeeId}/hr/`, formData);
      setMessage('HR review submitted successfully!');
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
      hr_remarks: '',
      proposed_basic_inc: '',
      proposed_gross_inc: '',
      proposed_basic_pp: '',
      proposed_gross_pp: '',
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

  if (loading) return <div>Loading HR appraisal...</div>;

  return (
    <form className="appraisal-form-container" onSubmit={handleSubmit}>
      {message && (
        <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      {/* HR Remarks */}
      <div className="form-section">
        <label className="section-title">Remarks from Human Resource</label>
        <textarea
          name="hr_remarks"
          className="form-textarea"
          value={formData.hr_remarks}
          onChange={handleChange}
          placeholder="Please validate this review and complement any necessary comment"
        />
      </div>

      {/* Salary / Promotion / Increment */}
      <div className="form-section">
        <label className="section-title">Promotion with Increment</label>
        <input
          type="text"
          name="proposed_basic_inc"
          className="form-input"
          placeholder="Proposed Basic"
          value={formData.proposed_basic_inc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="proposed_gross_inc"
          className="form-input"
          placeholder="Proposed Gross"
          value={formData.proposed_gross_inc}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <label className="section-title">Promotion / Increment / PP Decisions</label>
        {['promo_inc','promo_pp','inc_only','pp_only','deferred'].map((key) => (
          <div key={key} className="decision-item">
            <label>{key.replace(/_/g,' ')}</label>
            <div className="flex gap-4">
              <input
                type="checkbox"
                checked={!!formData.decisions[key]}
                data-decision={key}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}
        <textarea
          name="remarks"
          data-decision="remarks"
          className="form-textarea"
          placeholder="Remarks on your decision"
          value={formData.decisions.remarks}
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

export default HrAppraisal;
