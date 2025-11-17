import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api'; 
import { toast } from "react-toastify";

const GRADES_API_URL = 'system/configurations/grades/'; 


/* -------------------------
    Grade List Component
--------------------------*/
const GradeList = ({ rolePermissions, grades, setCurrentView, fetchGrades, handleEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrades = grades.filter((grade) =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if(!rolePermissions.delete){
      toast.warning("You don't have permission to delete.")
      return;
    }
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }
    try {
      await api.delete(`${GRADES_API_URL}${id}/`);
      toast.success("Grade deleted successfully!");
      fetchGrades(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error.response ? error.response.data : error.message);
      toast.error("Failed to delete grade.");
    }
  };

  return (
    <div className="grades-container-light">
      
      {/* Title */}
      <h2 className="page-title-light">Grades</h2>

      {/* Search + Add */}
      <div className="list-header-light">
        {rolePermissions.view && (
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
        )}

        {rolePermissions.create && (
          <button
            className="btn-add-new-light"
            onClick={() => setCurrentView('form')}
          >
            <Plus size={16} style={{ marginLeft: '0.5rem' }} />
            ADD GRADE
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper-light">
        <table className="data-table-light">
          <thead>
            <tr>
              {['ID', 'Name', 'Description']
                .concat((rolePermissions.edit || rolePermissions.delete) 
                  ? ['Actions'] : [])
                .map((header) => (
                  <th key={header} className="table-header-light">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                    <tr key={grade.id} className="table-row-light">
                      <td className="table-data-light">{grade.id}</td>
                      <td className="table-data-light table-data--name-light">
                          {grade.name}
                      </td>
                      <td className="table-data-light table-data--description-light">
                          {grade.description || 'N/A'}
                      </td>
                      {(rolePermissions.edit || rolePermissions.delete) && (
                        <td className="table-data-light">
                            <div className="action-buttons-light">
                              {rolePermissions.edit && (
                                <button
                                  title="Edit"
                                  className="action-button-light action-button--edit-light"
                                  onClick={() => handleEdit(grade)}
                                >
                                  <Pencil size={16} />
                                </button>
                              )}

                              {rolePermissions.delete && (
                                <button
                                  title="Delete"
                                  className="action-button-light action-button--delete-light"
                                  onClick={() => handleDelete(grade.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                        </td>
                      )}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className="no-data-message-light">
                        No grades.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/* -------------------------
    Grade Form Component
--------------------------*/
const GradeForm = ({ rolePermissions, setCurrentView, fetchGrades, editingGrade, setEditingGrade }) => {
  const isEditing = !!editingGrade;
  
  const initialFormState = {
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form if editing
  useEffect(() => {
    if (editingGrade && rolePermissions.edit) {
      setFormData({
        name: editingGrade.name || '',
        description: editingGrade.description || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingGrade, rolePermissions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setEditingGrade(null); // Clear editing state
    setCurrentView('list');
  };

  const handleSubmit = async (e, shouldAddAnother = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data
    const dataToSend = {
      ...formData,
      // Ensure description is sent as null if empty (matching Django model null=True)
      description: formData.description || null,
    };

    try {
      if (isEditing) {
        if(rolePermissions.edit){
          await api.put(`${GRADES_API_URL}${editingGrade.id}/`, dataToSend);
          toast.success("Grade updated successfully!");
        }else{
          toast.warning("You do not have permission to edit.")
          setLoading(false);
          return;
        }
      } else {
        if(rolePermissions.create){
          await api.post(GRADES_API_URL, dataToSend);
          toast.success("Grade added successfully!");
        } else {
          toast.warning("You do not have permission to create.")
          setLoading(false);
          return;
        }
      }
      
      fetchGrades(); // Refresh the list in the parent component

      if (shouldAddAnother) {
        setFormData(initialFormState); // Clear form for new entry
      } else {
        handleBack(); // Go back to the list
      }
      
    } catch (err) {
      console.error("Submit error:", err);
      
      let errorMessage = "Failed to save grade.";
      
      setError(errorMessage);
      toast.error("Failed to save grade.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grades-container-light">
      <h2 className="page-title-light form-title-light">
        <button
          className="btn-back-light"
          onClick={handleBack}
          disabled={loading}
        >
          <ArrowLeft size={24} />
        </button>
        {isEditing ? 'Edit Grade' : 'Add Grade'}
      </h2>

      <form onSubmit={handleSubmit} className="form-card-light">
        {/* Header */}
        <div className="form-header-bar-light">{isEditing ? 'Update Information' : 'Grade Information'}</div>
        
        {error && <div className="error-message">{error}</div>}

        {/* Fields */}
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
              placeholder="e.g., M-4"
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
              required
            />
          </div>

          <div className="form-group-light">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="8"
              value={formData.description}
              onChange={handleChange}
              className="input-field-light textarea-field-light"
              placeholder="Provide a detailed description of the scope and salary band for this grade."
              disabled={isEditing ? !rolePermissions.edit : !rolePermissions.create}
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions-light">
          {(isEditing ? rolePermissions.edit : rolePermissions.create) && (
            <button type="submit" className="btn-save-light btn-save-light--primary" disabled={loading}>
              {loading ? 'Processing...' : (isEditing ? 'UPDATE' : 'SAVE')}
            </button>
          )}

          {(!isEditing && rolePermissions.create) && (
            <button 
              type="button" 
              className="btn-save-light btn-save-light--secondary"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              Save and add another
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


/* -------------------------
    Main Grades Component
--------------------------*/
const Grades = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('list');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null); // Tracks the grade object being edited
  const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        const res = await api.get(`system/role-permissions/${user.role}/${"Configuration"}/${"Grade"}/`)
        console.log("User role permission:", res?.data)
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        console.warn("Error fatching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, []);


  const fetchGrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Requesting the correct URL: /api/system/grades/
      if(rolePermissions.view){
        const res = await api.get(GRADES_API_URL);
        console.log(res.data)
        setGrades(res.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Error fetching grades. Please check API connection and permissions.");
      toast.error("Failed to load grades.");
      setGrades([])
    } finally {
      setLoading(false);
    }
  }, [rolePermissions]);


  // Initial data load
  useEffect(() => {
    fetchGrades();
  }, [rolePermissions]);


  const handleEdit = (grade) => {
    if(rolePermissions.edit){
      setEditingGrade(grade);
      setCurrentView('form');
    } else {
      toast.warning("You don't have permission to edit.")
    }
  };


  if (loading) {
    return <div className="loading-message">Loading grades...</div>;
  }

  if (error && currentView === 'list') {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      {currentView === 'list' && (
        <GradeList 
          rolePermissions={rolePermissions}
          grades={grades} 
          setCurrentView={setCurrentView} 
          fetchGrades={fetchGrades}
          handleEdit={handleEdit}
        />
      )}
      {currentView === 'form' && (
        <GradeForm 
          rolePermissions={rolePermissions}
          setCurrentView={setCurrentView} 
          fetchGrades={fetchGrades}
          editingGrade={editingGrade}
          setEditingGrade={setEditingGrade}
        />
      )}
    </>
  );
};

export default Grades;