import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';

// Mock data for the List View
const MOCK_Workspaces = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Appraisal' },

];

/**
 * Component for the Department List View
 */
const DepartmentList = ({ departments, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* List Header */}
      <h2 className="page-title-light">Workspaces</h2>
      {/* Search + Add */}
      <div className="list-header-light">
        <div className="search-bar-container-light">
          <Search className="search-icon-light" size={18} />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-light"
          />
          
        </div>

        <button
          className="btn-add-new-light"
          onClick={() => setCurrentView('form')}
        >
          <Plus size={16} style={{ marginLeft: '0.5rem' }} />
          ADD WORKSPACE
          
        </button>
      </div>

      {/* Department Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['ID', 'Workspace Name', 'Actions'].map(header => (
                <th key={header} className="table-header-light">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map(dept => (
              <tr key={dept.id} className="table-row-light">
                <td className="table-data-light">{dept.id}</td>
                <td className="table-data-light table-data--name-light">{dept.name}</td>
                <td className="table-data-light">
                  <div className="action-buttons-light">
                    <button title="Edit" className="action-button-light action-button--edit-light">
                      <Pencil size={16} />
                    </button>
                    <button title="Delete" className="action-button-light action-button--delete-light">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDepartments.length === 0 && (
          <p className="no-data-message">No workspaces match your search criteria.</p>
        )}
      </div>
  </>  
  );
};

/**
 * Component for the Add Department Form View
 */
const DepartmentForm = ({ setCurrentView }) => {
  return (
    <div className="form-container-light">
      <h2 className="page-title-light">
        <button className="btn-back" onClick={() => setCurrentView('list')}>
          <ArrowLeft size={24} />
        </button>
        Add WORKSPACE
      </h2>

      <div className="card-light">
        {/* Header Bar */}
        <div className="form-header-bar-light">
          Basic Info
        </div>
        
        {/* Form Content */}
        <div className="form-content-light">
          
          <div className="form-group-light">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="input-field-light" 
              placeholder="Enter department name"
            />
          </div>

          <div className="form-group-light description-group">
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description" 
              name="description" 
              rows="6"
              className="input-field-light textarea-field-light"
              placeholder="Provide a detailed description of the department's role and responsibilities"
            ></textarea>
          </div>
          
        </div>
        
        {/* Action Buttons */}
        <div className="form-actions-light">
          <button className="btn-save-primary" onClick={() => console.log('Save clicked')}>SAVE</button>
          <button className="btn-save-secondary" onClick={() => console.log('Save and add another clicked')}>Save and add another</button>
          <button className="btn-save-secondary" onClick={() => console.log('Save and continue editing clicked')}>Save and continue editing</button>
        </div>
      </div>
    </div>
  );
};


// Main Departments Component with Navigation Logic
const Workspaces = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [departments, setDepartments] = useState(MOCK_Workspaces);

  return (
    <div className="departments-container-wrapper">
      {currentView === 'list' && (
        <DepartmentList departments={departments} setCurrentView={setCurrentView} />
      )}

      {currentView === 'form' && (
        <DepartmentForm setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default Workspaces;
