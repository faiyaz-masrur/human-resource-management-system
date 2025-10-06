import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';

// Mock data for the List View
const MOCK_GRADES = [
  { id: 1, name: 'E-1', description: 'Entry Level Staff' },
  { id: 2, name: 'E-5', description: 'Senior Specialist / Mid-Level' },
  { id: 3, name: 'M-3', description: 'Manager / Team Lead' },
  { id: 4, name: 'VP-1', description: 'Vice President / Executive Leadership' },
];

/* -------------------------
   Grade List Component
--------------------------*/
const GradeList = ({ grades, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrades = grades.filter((grade) =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grades-container-light">
      {/* Title */}
      <h2 className="page-title-light">Grades</h2>

      {/* Search + Add */}
      <div className="list-header-light">
        <div className="search-bar-container-light">
          <Search className="search-icon-light" size={18} />
          <input
            type="text"
            placeholder="Search grades..."
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
          ADD GRADE
          
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper-light">
        <table className="data-table-light">
          <thead>
            <tr>
              {['ID', 'Name', 'Description', 'Actions'].map((header) => (
                <th key={header} className="table-header-light">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade) => (
              <tr key={grade.id} className="table-row-light">
                <td className="table-data-light">{grade.id}</td>
                <td className="table-data-light table-data--name-light">
                  {grade.name}
                </td>
                <td className="table-data-light table-data--description-light">
                  {grade.description}
                </td>
                <td className="table-data-light">
                  <div className="action-buttons-light">
                    <button
                      title="Edit"
                      className="action-button-light action-button--edit-light"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Delete"
                      className="action-button-light action-button--delete-light"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGrades.length === 0 && (
          <p className="no-data-message-light">
            No grades match your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

/* -------------------------
   Grade Form Component
--------------------------*/
const GradeForm = ({ setCurrentView }) => {
  return (
    <div className="grades-container-light">
      <h2 className="page-title-light form-title-light">
        <button
          className="btn-back-light"
          onClick={() => setCurrentView('list')}
        >
          <ArrowLeft size={24} />
        </button>
        Add Grade
      </h2>

      <div className="form-card-light">
        {/* Header */}
        <div className="form-header-bar-light">Grade Information</div>

        {/* Fields */}
        <div className="form-content-light">
          <div className="form-group-light">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field-light"
              placeholder="e.g., M-4"
            />
          </div>

          <div className="form-group-light">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="8"
              className="input-field-light textarea-field-light"
              placeholder="Provide a detailed description of the scope and salary band for this grade."
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions-light">
          <button className="btn-save-light btn-save-light--primary">
            SAVE
          </button>
          <button className="btn-save-light btn-save-light--secondary">
            Save and add another
          </button>
          <button className="btn-save-light btn-save-light--secondary">
            Save and continue editing
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   Main Grades Component
--------------------------*/
const Grades = () => {
  const [currentView, setCurrentView] = useState('list');
  const [grades] = useState(MOCK_GRADES);

  return (
    <>
      {currentView === 'list' && (
        <GradeList grades={grades} setCurrentView={setCurrentView} />
      )}
      {currentView === 'form' && <GradeForm setCurrentView={setCurrentView} />}
    </>
  );
};

export default Grades;
