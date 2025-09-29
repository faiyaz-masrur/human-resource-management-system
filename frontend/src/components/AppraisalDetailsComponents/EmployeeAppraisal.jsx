import React, { useState } from 'react';
import axios from 'axios'; 

// Accepting a placeholder prop like employeeId to signify parent data source
const EmployeeAppraisal = ({ employeeId = '1001' }) => {
  
  // State for form data
  const [formData, setFormData] = useState({
    achievements: '',
    training_needs_top: '', 
    training_needs_bottom: '', 
    training_description: '', 
    soft_skills_training: true,
    business_training: true,
    technical_training: false,
  });

  // State for UI feedback
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission (Mocking API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      console.log(`Submitting appraisal for Employee ID: ${employeeId}`, formData);
      setMessage('Appraisal submitted successfully!');
      
      // Reset form on success
      setFormData({
          achievements: '',
          training_needs_top: '', 
          training_needs_bottom: '', 
          training_description: '', 
          soft_skills_training: false,
          business_training: false,
          technical_training: false,
      });

    } catch (error) {
      setIsError(true);
      setMessage('An error occurred during submission. Please check network/validation.');
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
    console.log('Form reset.');
  };

  return (
    <>
      <style>
        {`
          /* === Theme Variables & Global Styles === */
          :root {
            --color-card-background-light: white;
            --color-text-primary-dark: #333;
            --color-text-secondary-gray: #888;
            --color-accent-blue: #007bff; 
            --color-header-light: #444; 
            --color-border-light: #ccc; 
            --color-input-bg-light: #f9f9f9; 
            --color-button-primary: #007bff;
            --color-button-primary-hover: #0056b3;
            --color-success-bg: #d1fae5;
            --color-success-text: #059669;
            --color-error-bg: #fee2e2;
            --color-error-text: #dc2626;
          }

          .appraisal-page {
            background-color: var(--color-card-background-light); 
            font-family: 'Inter', sans-serif;
            padding: 30px; 
            min-height: 100vh;
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); 
          }
          
          .appraisal-form-container {
            width: 100%;
          }

          .appraisal-title {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--color-text-primary-dark);
            margin-bottom: 25px;
            padding-bottom: 5px;
          }

          /* === Form Sections === */
          .form-section {
            margin-bottom: 30px;
          }

          .form-header-group {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 5px;
            padding-top: 10px;
          }

          .section-title {
            font-size: 1rem;
            font-weight: 500;
            color: var(--color-header-light); 
          }

          .word-count-label {
            font-size: 0.8rem;
            color: var(--color-text-secondary-gray);
            font-style: italic;
            white-space: nowrap;
          }
          
          .form-textarea {
            width: 100%;
            min-height: 120px;
            padding: 10px 12px;
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            background-color: var(--color-input-bg-light);
            color: var(--color-text-primary-dark);
            font-size: 0.95rem;
            resize: vertical;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
            transition: border-color 0.2s;
          }
          .form-textarea:focus {
            outline: none;
            border-color: var(--color-accent-blue);
            box-shadow: 0 0 0 1px var(--color-accent-blue);
          }

          /* --- Custom Checkbox Layout Matching SS --- */
          .checkbox-header-group {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding-top: 10px;
              padding-bottom: 10px;
              border-top: 1px solid var(--color-border-light); 
          }
          .checkbox-group {
            display: flex;
            gap: 25px;
            margin-bottom: 15px;
          }
          .checkbox-item {
            display: flex;
            align-items: center;
          }
          .form-checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid var(--color-text-secondary-gray);
            border-radius: 2px;
            cursor: pointer;
            margin-right: 5px;
            transform: translateY(1px); /* slight adjustment for perfect alignment */
          }
          .checkbox-label {
            font-size: 0.95rem;
            font-weight: 400;
            color: var(--color-text-primary-dark);
            cursor: pointer;
          }

          /* === Messages === */
          .message-container {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            font-weight: 600;
            text-align: center;
          }
          .success-message {
            background-color: var(--color-success-bg);
            color: var(--color-success-text);
            border: 1px solid #a7f3d0;
          }
          .error-message {
            background-color: var(--color-error-bg);
            color: var(--color-error-text);
            border: 1px solid #fca5a5;
          }

          /* === Buttons === */
          .button-group {
            display: flex;
            gap: 10px;
            padding-top: 15px;
            border-top: 1px solid var(--color-border-light);
            margin-top: 20px;
            justify-content: flex-start; /* Buttons align to the left in SS */
          }
          .submit-button, .cancel-button {
            display: flex;
            align-items: center;
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, opacity 0.2s;
            border: 1px solid transparent;
            min-width: 100px; 
            justify-content: center;
          }
          
          .submit-button {
            background-color: var(--color-button-primary);
            color: white;
            border-color: var(--color-button-primary);
          }
          .submit-button:hover:not(:disabled) {
            background-color: var(--color-button-primary-hover);
          }
          .submit-button:disabled {
            background-color: #a0cffc;
            cursor: not-allowed;
            color: white;
            border-color: #a0cffc;
          }

          .cancel-button {
            background-color: white;
            color: var(--color-text-primary-dark);
            border: 1px solid var(--color-border-light);
          }
          .cancel-button:hover:not(:disabled) {
            background-color: #f0f0f0;
          }

          /* === Responsive Design === */
          @media (max-width: 768px) {
            .appraisal-page {
              padding: 15px;
            }
            .checkbox-group {
              flex-direction: column;
              gap: 10px;
            }
            .button-group {
              flex-wrap: wrap;
            }
          }
        `}
      </style>
      
      <div className="appraisal-page">
        <form className="appraisal-form-container" onSubmit={handleSubmit}>
                  
          {/* Display messages */}
          {message && (
            <div className={`message-container ${isError ? 'error-message' : 'success-message'}`}>
              {message}
            </div>
          )}

          {/* Achievements/Goal Completion Section */}
          <div className="form-section">
            <div className="form-header-group">
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
              rows={5}
              required
            ></textarea>
          </div>

          {/* Training & Development Plan Section (Box 1) */}
          <div className="form-section">
            <div className="form-header-group">
              <label htmlFor="training_needs_top" className="section-title">
                Training & Development Plan
              </label>
              <span className="word-count-label">Maximum 1000 words</span>
            </div>
            <textarea
              id="training_needs_top"
              name="training_needs_top"
              className="form-textarea"
              placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
              value={formData.training_needs_top}
              onChange={handleChange}
              rows={5}
            ></textarea>
          </div>
          
          {/* Training & Development Plan Section (Box 2 - Placeholder content in SS suggests a second box) */}
          <div className="form-section">
            <div className="form-header-group">
                {/* No title or word count label for the second training box in the SS */}
            </div>
            <textarea
              id="training_needs_bottom"
              name="training_needs_bottom"
              className="form-textarea"
              placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
              value={formData.training_needs_bottom}
              onChange={handleChange}
              rows={5}
            ></textarea>
          </div>


          {/* Further Training Section - Checkboxes and final text area */}
          <div className="form-section">
            <div className="checkbox-header-group">
                <label className="section-title">
                    What further training and/or experience do you feel would help your future performance and development?
                </label>
                <span className="word-count-label">Maximum 500 words</span>
            </div>

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

            <textarea
              id="training_description"
              name="training_description"
              className="form-textarea"
              placeholder="What do you consider to be your key development goals for the next review period? What support do you need to achieve them?"
              value={formData.training_description}
              onChange={handleChange}
              rows={5}
            ></textarea>

          </div>
          
          {/* Buttons Section */}
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EmployeeAppraisal;
