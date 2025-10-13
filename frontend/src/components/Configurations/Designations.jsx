import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Eye, X } from 'lucide-react';
import api from '../../services/api'; 

const DESIGNATIONS_API_URL = 'system/configurations/designations/';


// ===============================================
// Designations List Component
// ===============================================
const DesignationList = ({ 
  designations, 
  fetchDesignations, 
  setCurrentView, 
  handleEdit 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // NOTE: Mock data contains 'level' and 'department', which are not in the Django model.
  // We filter only by 'name' and 'grade' (which will be an object with a name).
  const filteredDesignations = designations.filter(des =>
    des.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (des.grade && des.grade.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) {
      return;
    }
    try {
      await api.delete(`${DESIGNATIONS_API_URL}${id}/`);
      toast.success("Designation deleted successfully!");
      fetchDesignations(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete designation.");
    }
  };

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
              {['ID', 'Name', 'Grade', 'Description', 'Actions'].map(header => (
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
                  {/* Access the name property of the nested grade object */}
                  <td className="table-data-light">{des.grade ? des.grade.name : 'N/A'}</td> 
                  <td className="table-data-light">{des.description || 'N/A'}</td>
                  <td className="table-data-light">
                    <div className="action-buttons-light">
                      <button 
                        title="Edit" 
                        className="action-button-light action-button--edit-light"
                        onClick={() => handleEdit(des)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        title="Delete" 
                        className="action-button-light action-button--delete-light"
                        onClick={() => handleDelete(des.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data-message">
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

// ===============================================
// Designation Form Component
// ===============================================
const DesignationForm = ({ setCurrentView, fetchDesignations, editingDesignation, setEditingDesignation }) => {
  const isEditing = !!editingDesignation;
  const initialFormState = {
    name: '',
    grade: '', // Stores the grade ID (integer)
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Grades for the Select Field
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get(GRADES_API_URL);
        setGrades(response.data);
      } catch (err) {
        console.error("Error fetching grades:", err);
        toast.error("Failed to load grades.");
      }
    };
    fetchGrades();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (editingDesignation) {
      setFormData({
        name: editingDesignation.name || '',
        // Use the ID for the select field
        grade: editingDesignation.grade ? editingDesignation.grade.id : '',
        description: editingDesignation.description || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingDesignation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setEditingDesignation(null);
    setCurrentView('list');
  };

  const handleSubmit = async (e, shouldAddAnother = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data (convert empty strings to null for optional fields like grade)
    const dataToSend = {
      ...formData,
      grade: formData.grade || null, // Ensure empty string becomes null for ForeignKey
      description: formData.description || null,
    };

    try {
      if (isEditing) {
        await api.put(`${DESIGNATIONS_API_URL}${editingDesignation.id}/`, dataToSend);
        toast.success("Designation updated successfully!");
      } else {
        await api.post(DESIGNATIONS_API_URL, dataToSend);
        toast.success("Designation added successfully!");
      }
      
      fetchDesignations(); // Refresh list after successful operation

      if (shouldAddAnother) {
        setFormData(initialFormState); // Clear form for new entry
      } else {
        handleBack(); // Go back to the list
      }
      
    } catch (err) {
      console.error("Submit error:", err.response ? err.response.data : err.message);
      setError("Failed to save designation. Check console for details.");
      toast.error("Failed to save designation.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="designations-container-wrapper">
      <h2 className="page-title-light">
        <button className="btn-back" onClick={handleBack} disabled={loading}>
          <ArrowLeft size={22} />
        </button>
        {isEditing ? 'Edit Designation' : 'Add Designation'}
      </h2>

      <form onSubmit={handleSubmit} className="card-light form-container-light">
        <div className="form-header-bar-light">{isEditing ? 'Update Details' : 'Designation Details'}</div>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-content-light">
          <div className="form-group-light">
            <label htmlFor="name">Name:*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field-light"
              placeholder="e.g., Lead Developer"
              required
            />
          </div>

          <div className="form-group-light">
            <label htmlFor="grade">Grade:</label>
            <div className="grade-input-group-light">
              <select 
                id="grade" 
                name="grade" 
                value={formData.grade}
                onChange={handleChange}
                className="input-field-light"
              >
                <option value="">----------</option>
                {grades.map(grade => (
                    <option key={grade.id} value={grade.id}>
                        {grade.name}
                    </option>
                ))}
              </select>

              {/* Action Icons (Placeholder - you need handlers for these) */}
              <button type="button" className="grade-action-icon" title="Edit Grade"><Pencil size={18} /></button>
              <button type="button" className="grade-action-icon" title="Add Grade"><Plus size={18} /></button>
              <button type="button" className="grade-action-icon" title="Delete Grade"><Trash2 size={18} /></button>
              <button type="button" className="grade-action-icon" title="View Grades"><Eye size={18} /></button>
            </div>
          </div>

          <div className="form-group-light">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className="input-field-light textarea-field-light"
              placeholder="Describe the primary responsibilities and reporting structure for this designation."
            ></textarea>
          </div>
        </div>

        <div className="form-actions-light">
          <button type="submit" className="btn-save-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
          </button>
          
          {!isEditing && (
            <button 
              type="button" 
              className="btn-save-secondary"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              Save and Add Another
            </button>
          )}

          <button type="button" className="btn-cancel-light" onClick={handleBack} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ===============================================
// Main Component
// ===============================================
const Designations = () => {
  const [currentView, setCurrentView] = useState('list');
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDesignation, setEditingDesignation] = useState(null); // State for editing

  // Fetch function wrapped in useCallback
  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Requesting the correct URL: /api/system/designations/
      const res = await api.get(DESIGNATIONS_API_URL);
      setDesignations(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Failed to load designations. Please check API server.");
      toast.error("Error fetching departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  const handleEdit = (designation) => {
    setEditingDesignation(designation);
    setCurrentView('form');
  };

  if (loading) {
    return <div className="loading-message">Loading designations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <>
      {currentView === 'list' && (
        <DesignationList 
          designations={designations} 
          fetchDesignations={fetchDesignations}
          setCurrentView={setCurrentView} 
          handleEdit={handleEdit}
        />
      )}
      {currentView === 'form' && (
        <DesignationForm 
          setCurrentView={setCurrentView} 
          fetchDesignations={fetchDesignations}
          editingDesignation={editingDesignation}
          setEditingDesignation={setEditingDesignation}
        />
      )}
    </>
  );
};

export default Designations;