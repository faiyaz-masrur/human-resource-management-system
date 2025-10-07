import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Eye } from 'lucide-react';

// Mock data
const MOCK_DESIGNATIONS = [
  { id: 101, name: 'Senior Software Engineer', grade: 'E-5', level: 'Mid', department: 'Technology' },
  { id: 102, name: 'HR Manager', grade: 'M-3', level: 'Management', department: 'Human Resources' },
  { id: 103, name: 'Assistant Vice President', grade: 'VP-1', level: 'Senior Leadership', department: 'R&D' },
];

const DesignationList = ({ designations, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDesignations = designations.filter(des =>
    des.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    des.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="designations-container-wrapper">
      
      {/* List Header */}
      <h2 className="page-title-light">Designations</h2>
      {/* Search + Add */}
      <div className="list-header-light">
        <div className="search-bar-container-light">
          <Search className="search-icon-light" size={18} />
          <input
            type="text"
            placeholder="Search designations..."
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
          ADD DESIGNATION
          
        </button>
      </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {['ID', 'Name', 'Grade', 'Level', 'Department', 'Actions'].map(header => (
                  <th key={header} className="table-header-light">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDesignations.length > 0 ? (
                filteredDesignations.map(des => (
                  <tr key={des.id} className="table-row-light">
                    <td className="table-data-light">{des.id}</td>
                    <td className="table-data-light table-data--name-light">{des.name}</td>
                    <td className="table-data-light">{des.grade}</td>
                    <td className="table-data-light">{des.level}</td>
                    <td className="table-data-light">{des.department}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-message">
                    No designations match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

const DesignationForm = ({ setCurrentView }) => {
  return (
    <div className="designations-container-wrapper">
      <h2 className="page-title-light">
        <button className="btn-back" onClick={() => setCurrentView('list')}>
          <ArrowLeft size={22} />
        </button>
        Add Designation
      </h2>

      <div className="card-light form-container-light">
        <div className="form-header-bar-light">Designation Details</div>

        <div className="form-content-light">
          <div className="form-group-light">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field-light"
              placeholder="e.g., Lead Developer"
            />
          </div>

          <div className="form-group-light">
            <label htmlFor="grade">Grade:</label>
            <div className="grade-input-group-light">
              <select id="grade" name="grade" className="input-field-light">
                <option>----------</option>
                <option value="E-5">E-5 (Senior)</option>
                <option value="M-3">M-3 (Manager)</option>
                <option value="VP-1">VP-1 (Executive)</option>
              </select>

              {/* Action Icons */}
              <button className="grade-action-icon" title="Edit Grade">
                <Pencil size={18} />
              </button>
              <button className="grade-action-icon" title="Add Grade">
                <Plus size={18} />
              </button>
              <button className="grade-action-icon" title="Delete Grade">
                <Trash2 size={18} />
              </button>
              <button className="grade-action-icon" title="View Grades">
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div className="form-group-light">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              className="input-field-light textarea-field-light"
              placeholder="Describe the primary responsibilities and reporting structure for this designation."
            ></textarea>
          </div>
        </div>

        <div className="form-actions-light">
          <button className="btn-save-primary">Save</button>
          <button className="btn-save-secondary">Save and Add Another</button>
          <button className="btn-save-secondary">Save and Continue Editing</button>
          
        </div>
      </div>
    </div>
  );
};

const Designations = () => {
  const [currentView, setCurrentView] = useState('list');
  const [designations] = useState(MOCK_DESIGNATIONS);

  return (
    /* FIX applied here: Wrapping in a React Fragment */
    <>
      {currentView === 'list' && (
        <DesignationList designations={designations} setCurrentView={setCurrentView} />
      )}
      {currentView === 'form' && (
        <DesignationForm setCurrentView={setCurrentView} />
      )}
    </>
  );
};

export default Designations;