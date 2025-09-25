import React from 'react';


const Departments = () => {
  return (
    <div className="departments-container">
      <h2 className="page-title">Add Department</h2>

      <div className="add-department-header">
        <button className="add-department-button">
          ADD DEPARTMENT
          <span className="plus-icon">+</span>
        </button>
      </div>

      <div className="department-form-card">
        <div className="form-header-bar">
          Basic Info
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

export default Departments;