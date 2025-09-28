import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';

// Mock data for the List View
const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Research & Development (R&D)', manager: 'Dr. Jane Smith', employees: 45 },
  { id: 2, name: 'Human Resources (HR)', manager: 'Mr. Alex Johnson', employees: 12 },
  { id: 3, name: 'Technology', manager: 'Ms. Sarah Connor', employees: 120 },
  { id: 4, name: 'Marketing & Sales', manager: 'Mr. Tom Hardy', employees: 55 },
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
    <div className="card-light department-list-card">
      {/* List Header */}
      <div className="content-header-light">
        <h1 className="section-title-light">Department List ({departments.length})</h1>
        <button 
          className="btn-add-new" 
          onClick={() => setCurrentView('form')}
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search departments by name or manager..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-light"
        />
      </div>

      {/* Department Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['ID', 'Department Name', 'Manager', 'Employees', 'Actions'].map(header => (
                <th key={header} className="table-header-light">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map(dept => (
              <tr key={dept.id} className="table-row-light">
                <td className="table-data-light">{dept.id}</td>
                <td className="table-data-light table-data--name-light">{dept.name}</td>
                <td className="table-data-light">{dept.manager}</td>
                <td className="table-data-light">{dept.employees}</td>
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
          <p className="no-data-message">No departments match your search criteria.</p>
        )}
      </div>
    </div>
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
        Add Department
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
const Departments = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);

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
            --color-accent-blue: #007bff; /* Primary blue for buttons/focus */
            --color-header-blue-dark: #3b82f6; /* Darker blue for info headers */
            --color-border-light: #e5e7eb;
            --color-input-bg-light: white;
            --color-button-primary: #007bff;
            --color-button-primary-hover: #0056b3;
            --color-action-bar-bg: #f9fafb;
            --color-edit-bg: #eff6ff;
            --color-edit-icon: #2563eb;
            --color-delete-bg: #fee2e2;
            --color-delete-icon: #dc2626;
          }

          .departments-container-wrapper {
            min-height: 100vh;
            background-color: var(--color-background-light);
            font-family: 'Inter', sans-serif;
            padding: 2rem;
          }
          
          /* === Shared Card and Title Styles === */
          .page-title-light {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: var(--color-text-primary-dark);
            display: flex;
            align-items: center;
          }

          .card-light {
            max-width: 1000px;
            margin: 0 auto;
            background-color: var(--color-card-background-light);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          /* === List View Specific Styles === */

          .department-list-card {
            padding: 1.5rem;
          }

          .content-header-light {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .section-title-light {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-text-primary-dark);
          }

          .btn-add-new {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.25rem;
            background-color: var(--color-button-primary);
            color: white;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .btn-add-new:hover {
            background-color: var(--color-button-primary-hover);
          }
          
          /* Search Bar in List */
          .search-bar-container {
            position: relative;
            margin-bottom: 1.5rem;
          }
          .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-secondary-gray);
          }
          .search-input-light {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 3rem; /* Padding for icon */
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            font-size: 0.9375rem;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.2s;
            background-color: var(--color-input-bg-light);
            color: var(--color-text-primary-dark);
          }
          .search-input-light:focus {
            outline: none;
            border-color: var(--color-accent-blue);
            box-shadow: 0 0 0 1px var(--color-accent-blue);
          }


          /* Table Styles */
          .table-wrapper {
            overflow-x: auto;
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
          }
          .data-table {
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
          .no-data-message {
            padding: 2rem;
            text-align: center;
            color: var(--color-text-secondary-gray);
          }

          /* Action Buttons */
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

          .form-container-light {
            max-width: 800px;
            margin: 0 auto;
          }

          .btn-back {
            background: none;
            border: none;
            color: var(--color-text-primary-dark);
            cursor: pointer;
            margin-right: 0.5rem;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          .btn-back:hover {
            background-color: var(--color-border-light);
          }

          .form-header-bar-light {
            background-color: var(--color-header-blue-dark);
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
          
          .input-field-light {
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

          .input-field-light:focus {
            outline: none;
            border-color: var(--color-accent-blue);
            box-shadow: 0 0 0 1px var(--color-accent-blue);
          }

          .textarea-field-light {
            min-height: 8rem;
            resize: vertical;
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
          .btn-save-primary, .btn-save-secondary {
            padding: 0.6rem 1.25rem;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .btn-save-primary {
            background-color: var(--color-button-primary);
            color: white;
            font-weight: 700;
          }
          .btn-save-primary:hover {
            background-color: var(--color-button-primary-hover);
          }

          .btn-save-secondary {
            background-color: #e9ecef; /* Light gray background */
            color: var(--color-text-primary-dark);
          }
          .btn-save-secondary:hover {
            background-color: #d8dee3;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .departments-container-wrapper {
              padding: 1rem;
            }
            .content-header-light {
              flex-direction: column;
              align-items: flex-start;
            }
            .btn-add-new {
              width: 100%;
              justify-content: center;
              margin-top: 1rem;
            }
            .form-actions-light {
              flex-direction: column;
              gap: 0.5rem;
            }
            .form-actions-light button {
              width: 100%;
            }
          }

        `}
      </style>
      
      <div className="departments-container-wrapper">
        
        {currentView === 'list' && (
          <DepartmentList departments={departments} setCurrentView={setCurrentView} />
        )}

        {currentView === 'form' && (
          <DepartmentForm setCurrentView={setCurrentView} />
        )}
      </div>
    </>
  );
};

export default Departments;
