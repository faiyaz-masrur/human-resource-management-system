import React from 'react';


const Designations = () => {
  return (
    <div className="designations-container">
      <h2 className="page-title">Add Designation</h2>

      <div className="add-designation-header">
        <button className="add-designation-button">
          ADD DESIGNATION
          <span className="plus-icon">+</span>
        </button>
      </div>

      <div className="designation-form-card">
        <div className="form-header-bar">
          Designation Details
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

          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <div className="grade-input-group">
              <select id="grade" name="grade" className="light-select">
                <option>----------</option>
              </select>
              {/* Action icons */}
              <span className="action-icon edit-icon">📝</span>
              <span className="action-icon add-icon">+</span>
              <span className="action-icon delete-icon">❌</span>
              <span className="action-icon view-icon">👁️</span>
            </div>
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

export default Designations;