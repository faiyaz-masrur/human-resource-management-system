import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Eye } from 'lucide-react';

// Mock data for the List View
const MOCK_DESIGNATIONS = [
  { id: 101, name: 'Senior Software Engineer', grade: 'E-5', level: 'Mid', department: 'Technology' },
  { id: 102, name: 'HR Manager', grade: 'M-3', level: 'Management', department: 'Human Resources' },
  { id: 103, name: 'Assistant Vice President', grade: 'VP-1', level: 'Senior Leadership', department: 'R&D' },
];

/**
 * Component for the Designation List View (Light Theme)
 */
const DesignationList = ({ designations, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDesignations = designations.filter(des =>
    des.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    des.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="designations-container-light">
      {/* Title */}
      <h2 className="page-title-light">Select Designation to change</h2>

      {/* Header and Add Button */}
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
          <button className="search-button-light">Search</button>
        </div>
        <button 
          className="btn-add-new-light" 
          onClick={() => setCurrentView('form')}
        >
          ADD DESIGNATION
          <Plus size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
      
      {/* Designation Count */}
      <p className="designation-count-light">{filteredDesignations.length} Designations</p>

      {/* Designation Table */}
      <div className="table-wrapper-light">
        <table className="data-table-light">
          <thead>
            <tr>
              {['ID', 'Name', 'Grade', 'Level', 'Department', 'Actions'].map(header => (
                <th key={header} className="table-header-light">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDesignations.map(des => (
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
            ))}
          </tbody>
        </table>
        {filteredDesignations.length === 0 && (
          <p className="no-data-message-light">No designations match your criteria.</p>
        )}
      </div>
    </div>
  );
};

/**
 * Component for the Add Designation Form View (Light Theme)
 */
const DesignationForm = ({ setCurrentView }) => {
  return (
    <div className="designations-container-light">
      <h2 className="page-title-light form-title-light">
        <button className="btn-back-light" onClick={() => setCurrentView('list')}>
          <ArrowLeft size={24} />
        </button>
        Add Designation
      </h2>

      <div className="form-card-light">
        {/* Header Bar */}
        <div className="form-header-bar-light">
          Designation Details
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
              placeholder="e.g., Lead Developer"
            />
          </div>

          <div className="form-group-light">
            <label htmlFor="grade">Grade:</label>
            <div className="grade-input-group-light">
              <select id="grade" name="grade" className="select-field-light">
                <option>----------</option>
                <option value="E-5">E-5 (Senior)</option>
                <option value="M-3">M-3 (Manager)</option>
                <option value="VP-1">VP-1 (Executive)</option>
              </select>
              
              {/* Action Icons for Grade Field */}
              <button title="Edit Grade" className="grade-action-icon grade-action-icon--edit">
                <Pencil size={18} />
              </button>
              <button title="Add Grade" className="grade-action-icon grade-action-icon--add">
                <Plus size={18} />
              </button>
              <button title="Delete Grade" className="grade-action-icon grade-action-icon--delete">
                <Trash2 size={18} />
              </button>
              <button title="View Grades" className="grade-action-icon grade-action-icon--view">
                <Eye size={18} />
              </button>
            </div>
          </div>


          <div className="form-group-light description-group-light">
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description" 
              name="description" 
              rows="8"
              className="input-field-light textarea-field-light"
              placeholder="Describe the primary responsibilities and reporting structure for this designation."
            ></textarea>
          </div>
          
        </div>
        
        {/* Action Buttons */}
        <div className="form-actions-light">
          <button className="btn-save-light btn-save-light--primary" onClick={() => console.log('Save clicked')}>SAVE</button>
          <button className="btn-save-light btn-save-light--secondary" onClick={() => console.log('Save and add another clicked')}>Save and add another</button>
          <button className="btn-save-light btn-save-light--secondary" onClick={() => console.log('Save and continue editing clicked')}>Save and continue editing</button>
        </div>
      </div>
    </div>
  );
};


// Main Designations Component with Navigation Logic
const Designations = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [designations] = useState(MOCK_DESIGNATIONS);

  return (
    <>
      <style>
        {`
          /* === Global Light Theme Variables === */
          :root {
            --color-background-light: #f4f7f9; /* Off-white page background */
            --color-card-background-light: white;
            --color-text-primary-dark: #1f2937;
            --color-text-secondary-gray: #6b7280;
            --color-accent-blue: #007bff; /* Primary blue for focus/links */
            --color-header-blue-light: #3b82f6; /* Blue for header bar */
            --color-border-light: #e5e7eb;
            --color-input-bg-light: white;
            --color-search-bg-light: #f9fafb;
            --color-button-primary: #007bff;
            --color-button-primary-hover: #0056b3;
            --color-action-bar-bg: #f9fafb;
            --color-edit-bg: #eff6ff;
            --color-edit-icon: #2563eb;
            --color-delete-bg: #fee2e2;
            --color-delete-icon: #dc2626;
          }

          .designations-container-light {
            min-height: 100vh;
            background-color: var(--color-background-light);
            font-family: 'Inter', sans-serif;
            color: var(--color-text-primary-dark);
            padding: 2rem;
            margin: 0 auto;
          }
          
          /* === Shared Title Styles === */
          .page-title-light {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: var(--color-text-primary-dark);
            display: flex;
            align-items: center;
          }
          
          /* === List View Specific Styles === */

          .list-header-light {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .search-bar-container-light {
            flex-grow: 1;
            display: flex;
            background-color: var(--color-input-bg-light);
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid var(--color-border-light);
            position: relative;
            max-width: 600px;
          }
          .search-icon-light {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-secondary-gray);
          }
          .search-input-light {
            flex-grow: 1;
            padding: 0.65rem 1rem 0.65rem 2.5rem;
            background-color: transparent;
            color: var(--color-text-primary-dark);
            border: none;
            font-size: 0.9375rem;
          }
          .search-input-light:focus {
            outline: none;
          }
          .search-button-light {
            padding: 0.65rem 1rem;
            background-color: var(--color-search-bg-light);
            color: var(--color-text-secondary-gray);
            border: none;
            cursor: pointer;
            border-left: 1px solid var(--color-border-light);
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.2s, background-color 0.2s;
          }
          .search-button-light:hover {
            color: var(--color-text-primary-dark);
            background-color: #eef2f5;
          }

          .btn-add-new-light {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 1rem;
            background-color: var(--color-header-blue-light);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: 1.5rem;
          }
          .btn-add-new-light:hover {
            background-color: #2563eb;
          }

          .designation-count-light {
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: var(--color-text-secondary-gray);
          }


          /* Table Styles - Light Theme */
          .table-wrapper-light {
            overflow-x: auto;
            background-color: var(--color-card-background-light);
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .data-table-light {
            min-width: 100%;
            border-collapse: collapse;
          }
          .table-header-light {
            padding: 0.75rem 1rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--color-text-secondary-gray);
            text-transform: uppercase;
            background-color: var(--color-action-bar-bg);
            border-bottom: 1px solid var(--color-border-light);
          }
          .table-row-light {
            border-bottom: 1px solid var(--color-border-light);
          }
          .table-row-light:last-child {
            border-bottom: none;
          }
          .table-row-light:hover {
            background-color: #f0f4f7;
          }
          .table-data-light {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: var(--color-text-primary-dark);
          }
          .table-data--name-light {
            font-weight: 500;
          }
          .no-data-message-light {
            padding: 2rem;
            text-align: center;
            color: var(--color-text-secondary-gray);
          }
          
          /* Action Buttons in Table */
          .action-buttons-light {
            display: flex;
            gap: 0.5rem;
          }
          .action-button-light {
            padding: 0.5rem;
            border-radius: 50%;
            width: 2.25rem;
            height: 2.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
          }
          .action-button--edit-light {
            background-color: var(--color-edit-bg);
            color: var(--color-edit-icon);
          }
          .action-button--edit-light:hover {
            background-color: #dbeafe;
          }
          .action-button--delete-light {
            background-color: var(--color-delete-bg);
            color: var(--color-delete-icon);
          }
          .action-button--delete-light:hover {
            background-color: #fecaca;
          }


          /* === Form View Specific Styles === */

          .form-title-light {
            max-width: 800px;
            margin: 0 auto 2rem;
          }

          .btn-back-light {
            background: none;
            border: none;
            color: var(--color-text-primary-dark);
            cursor: pointer;
            margin-right: 0.5rem;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          .btn-back-light:hover {
            background-color: var(--color-border-light);
          }

          .form-card-light {
            max-width: 800px;
            margin: 0 auto;
            background-color: var(--color-card-background-light);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .form-header-bar-light {
            background-color: var(--color-header-blue-light);
            color: white;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
          }

          .form-content-light {
            padding: 1.5rem;
          }

          .form-group-light {
            margin-bottom: 1.5rem;
          }

          .form-group-light label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--color-text-primary-dark);
            font-size: 0.9375rem;
          }
          
          /* Input and Select Styling */
          .input-field-light, .select-field-light {
            width: 100%;
            padding: 0.65rem 1rem;
            background-color: var(--color-input-bg-light);
            color: var(--color-text-primary-dark);
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            font-size: 0.9375rem;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .input-field-light:focus, .select-field-light:focus {
            outline: none;
            border-color: var(--color-accent-blue);
            box-shadow: 0 0 0 1px var(--color-accent-blue);
          }
          .textarea-field-light {
            min-height: 10rem;
            resize: vertical;
          }
          
          /* Grade Input Group Styling (Complex Field) */
          .grade-input-group-light {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .grade-input-group-light .select-field-light {
            flex-grow: 1;
            width: auto; /* Override 100% width from general rule */
          }

          .grade-action-icon {
            padding: 0.5rem;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-border-light);
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            color: white; /* Icons themselves are white, background provides color */
          }
          .grade-action-icon--edit {
            background-color: #6366f1; /* Indigo */
          }
          .grade-action-icon--add {
            background-color: #10b981; /* Green */
          }
          .grade-action-icon--delete {
            background-color: #ef4444; /* Red */
          }
          .grade-action-icon--view {
            background-color: #f59e0b; /* Amber/Yellow */
          }
          .grade-action-icon:hover {
            filter: brightness(0.9);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }


          /* Form Actions Bar (Bottom Buttons) */
          .form-actions-light {
            background-color: var(--color-action-bar-bg);
            padding: 1rem 1.5rem;
            display: flex;
            gap: 0.75rem;
            border-top: 1px solid var(--color-border-light);
          }

          /* Button Styling */
          .btn-save-light {
            padding: 0.6rem 1.25rem;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .btn-save-light--primary {
            background-color: var(--color-button-primary);
            color: white;
            font-weight: 700;
          }
          .btn-save-light--primary:hover {
            background-color: var(--color-button-primary-hover);
          }
          .btn-save-light--secondary {
            background-color: #e9ecef;
            color: var(--color-text-primary-dark);
          }
          .btn-save-light--secondary:hover {
            background-color: #d8dee3;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .designations-container-light {
              padding: 1rem;
            }
            .list-header-light {
              flex-direction: column;
              align-items: stretch;
            }
            .search-bar-container-light {
              max-width: 100%;
              margin-bottom: 1rem;
            }
            .btn-add-new-light {
              width: 100%;
              justify-content: center;
              margin-left: 0;
            }
            .form-actions-light {
              flex-direction: column;
              gap: 0.5rem;
            }
            .form-actions-light button {
              width: 100%;
            }
            .grade-input-group-light {
              flex-wrap: wrap;
            }
            .grade-input-group-light .select-field-light {
              flex-basis: 100%;
              margin-bottom: 0.5rem;
            }
            .grade-action-icon {
              flex-grow: 1;
              max-width: 24%; /* Distribute 4 icons evenly */
            }
          }
        `}
      </style>
      
      {/* Container for conditional rendering */}
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
