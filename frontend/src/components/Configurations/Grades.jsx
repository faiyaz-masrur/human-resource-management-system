import React from 'react';


const Grades = () => {
  return (
    <div className="grades-container">
      <h2 className="page-title">Add Grade</h2>

      <div className="add-grade-header">
        <button className="add-grade-button">
          ADD GRADE
          <span className="plus-icon">+</span>
        </button>
      </div>

      <div className="grade-form-card">
        <div className="form-header-bar">
          Grade Information
        </div>
        
        <div className="form-content">
          
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="light-input" 
            />
          </div>

          <div className="form-group description-group">
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description" 
              name="description" 
              rows="8"
              className="light-textarea"
            ></textarea>
          </div>
          
        </div>
        
        <div className="form-actions-light">
          <button className="btn btn-save-light">SAVE</button>
          <button className="btn btn-save-add-light">Save and add another</button>
          <button className="btn btn-save-continue-light">Save and continue editing</button>
        </div>
      </div>
    </div>
  );
};

export default Grades;