import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';


const DEPARTMENT_API_URL = 'system/configurations/departments/'; 

// ==============================================================================
// 1. Component for the Add/Edit Department Form View
// ==============================================================================
const DepartmentForm = ({ rolePermissions, setCurrentView, currentDepartment, refreshList }) => {
    const isEditMode = !!currentDepartment;
    const initialFormData = {
        name: currentDepartment?.name || '',
        description: currentDepartment?.description || '', 
    };
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        if(rolePermissions.edit){
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };
    
    const handleBack = () => {
        setCurrentView('list');
    };

    const handleSubmit = async (saveOption) => {
        setLoading(true);
        setError(null);
        
        const dataToSend = {
            ...formData,
            description: formData.description.trim() || null, 
        };
        
        try {
            let res;
            if (isEditMode) {
                if(rolePermissions.edit){
                    res = await api.put(`${DEPARTMENT_API_URL}${currentDepartment.id}/`, dataToSend);
                    toast.success(`Department "${res.data.name}" updated successfully!`);
                }else{
                    alert("You do not have permission to edit.")
                    setLoading(false);
                    return;
                }
            } else {
                if(rolePermissions.create){
                    res = await api.post(DEPARTMENT_API_URL, dataToSend);
                    toast.success(`Department "${res.data.name}" added successfully!`);
                } else {
                    alert("You do not have permission to create.")
                    setLoading(false);
                    return;
                }
            }
            
            await refreshList(); 

            if (saveOption === 'save') {
                handleBack();
            } else if (saveOption === 'saveAndAdd') {
                setFormData(initialFormData); // Clear form for new entry
            }
            // 'saveAndContinue' simply stays on the form and keeps the data
            
        } catch (err) {
            console.error("Save error:", err.response ? err.response.data : err.message);
            
            let errorMessage = "Failed to save department.";
            if (err.response && err.response.data && err.response.data.name) {
                errorMessage = `Error: Name ${err.response.data.name[0]}`;
            } else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container-light">
            <h2 className="page-title-light">
                <button 
                    className="btn-back" 
                    onClick={handleBack} 
                    disabled={loading}
                >
                    <ArrowLeft size={24} />
                </button>
                {isEditMode ? 'Edit Department' : 'Add Department'}
            </h2>

            <div className="card-light">
                {/* Header Bar */}
                <div className="form-header-bar-light">
                    Basic Info
                </div>

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}
                
                {/* Form Content */}
                <div className="form-content-light">
                    <div className="form-group-light">
                        <label htmlFor="name">Name:*</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            className="input-field-light" 
                            placeholder="Enter department name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading || (isEditMode ? !rolePermissions.edit : !rolePermissions.create)}
                            required
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
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading || (isEditMode ? !rolePermissions.edit : !rolePermissions.create)}
                        ></textarea>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions-light">
                    {(isEditMode ? rolePermissions.edit : rolePermissions.create) && (
                        <button 
                            className="btn-save-primary" 
                            onClick={() => handleSubmit('save')} 
                            disabled={loading || !formData.name}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                            {isEditMode ? "UPDATE" : "SAVE"}
                        </button>
                    )}
                    
                    {(!isEditMode && rolePermissions.create) && (
                        <button 
                            className="btn-save-secondary" 
                            onClick={() => handleSubmit('saveAndAdd')}
                            disabled={loading || !formData.name}
                        >
                            Save and add another
                        </button>
                    )}
                    
                    {(isEditMode && rolePermissions.edit) && (
                        <button 
                            className="btn-save-secondary" 
                            onClick={() => handleSubmit('saveAndContinue')}
                            disabled={loading || !formData.name}
                        >
                            Save and continue editing
                        </button>
                    )}

                    <button type="button" className="btn-cancel-light" onClick={handleBack} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==============================================================================
// 2. Component for the Department List View
// ==============================================================================
const DepartmentList = ({ rolePermissions, departments, setCurrentView, startEdit, handleDelete, isLoading, error }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // --- Search Filtering ---
    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="departments-container-light">
            {/* List Header */}
            <h2 className="page-title-light">Departments</h2>
            
            {/* Search + Add */}
            <div className="list-header-light">
                {rolePermissions.view && (
                    <div className="search-bar-container-light">
                        <Search className="search-icon-light" size={18} />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-light"
                            disabled={isLoading}
                        />
                    </div>
                )}
                
                {rolePermissions.create && (
                    <button
                        className="btn-add-new-light"
                        onClick={() => setCurrentView('form')}
                        disabled={isLoading}
                    >
                        <Plus size={16} style={{ marginLeft: '0.5rem' }} />
                        ADD DEPARTMENT
                    </button>
                )}
            </div>

            {/* Loading/Error State */}
            {isLoading && (
                <div className="loading-message">
                    <Loader2 size={24} className="animate-spin mr-2" />
                    Loading departments...
                </div>
            )}
            {error && <div className="error-message">Error fetching departments: {error}</div>}
            
            {/* Department Table */}
            {!isLoading && !error && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {['ID', 'Department Name', 'Description']
                                    .concat((rolePermissions.edit || rolePermissions.delete)
                                         ? ['Actions'] : [])
                                    .map(header => (
                                        <th key={header} className="table-header-light">{header}</th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.length > 0 ? (
                                filteredDepartments.map(dept => (
                                    <tr key={dept.id} className="table-row-light">
                                        <td className="table-data-light">{dept.id}</td>
                                        <td className="table-data-light table-data--name-light">{dept.name}</td>
                                        <td className="table-data-light">{dept.description || 'N/A'}</td>
                                        {(rolePermissions.edit || rolePermissions.delete) && (
                                            <td className="table-data-light">
                                                <div className="action-buttons-light">
                                                    {rolePermissions.edit && (
                                                        <button 
                                                            title="Edit" 
                                                            className="action-button-light action-button--edit-light"
                                                            onClick={() => startEdit(dept)}
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    )}
                                                    {rolePermissions.delete && (
                                                        <button 
                                                            title="Delete" 
                                                            className="action-button-light action-button--delete-light"
                                                            onClick={() => handleDelete(dept.id, dept.name)}
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
                                    <td colSpan="4" className="no-data-message">
                                        {searchTerm ? "No departments match your search criteria." : "No departments."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ==============================================================================
// 3. Main Departments Component with Logic
// ==============================================================================
const Departments = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
    const [departments, setDepartments] = useState([]);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rolePermissions, setRolePermissions] = useState({});


  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        const res = await api.get(`system/role-permissions/${user.role}/${"Configuration"}/${"Department"}/`)
        console.log("User role permission:", res?.data)
        setRolePermissions(res?.data || {}); 
      } catch (error) {
        console.warn("Error fatching role permissions", error);
        setRolePermissions({}); 
      }
    };

    fetchRolePermissions();
  }, []);
    

    // --- Data Fetching Logic (Stabilized with useCallback) ---
    const fetchDepartments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if(rolePermissions.view){
                const res = await api.get(DEPARTMENT_API_URL);
                console.log(res.data)
                setDepartments(res.data || []);
            } 
        } catch (err) {
            console.error("Fetch error:", err.response ? err.response.data : err.message);

            
            // Provide a better error message to the user
            const displayError = err.response?.status === 403 
                ? "Permission denied. Check user role." 
                : "Failed to load data. Check API server and network.";
                
            setError(displayError);
            setDepartments([]);
        } finally {
            setIsLoading(false);
        }
    }, [rolePermissions]); 

    // --- Initial Data Load ---
    useEffect(() => {
        fetchDepartments();
    }, [rolePermissions]); 


    // --- CRUD Actions ---
    const handleStartEdit = (dept) => {
        if(rolePermissions.edit){
            setEditingDepartment(dept);
            setCurrentView('form');
        } else {
            alert("You don't have permission to edit.")
        }
    };

    const handleDelete = async (id, name) => {
        if(!rolePermissions.delete){
            alert("You don't have permission to delete.")
            return;
        }
        if (window.confirm(`Are you sure you want to delete the department: "${name}"?`)) {
            setIsLoading(true); // Disable buttons during deletion
            try {
                await api.delete(`${DEPARTMENT_API_URL}${id}/`);
                toast.success(`Department "${name}" deleted successfully.`);
            
                // Optimistically remove from local state
                setDepartments(departments.filter(dept => dept.id !== id));
            } catch (err) {
                console.error("Delete error:", err.response ? err.response.data : err.message);
                const message = err.response?.data?.detail || "It might be associated with employees or other data.";
                alert(`Failed to delete department. ${message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- View Navigation ---
    const handleSetCurrentView = (view) => {
        if (view === 'list') {
            setEditingDepartment(null); // Clear editing state when returning to list
        }
        setCurrentView(view);
    };

    return (
        <div className="departments-container-wrapper">
            {currentView === 'list' && (
                <DepartmentList
                    rolePermissions={rolePermissions}
                    departments={departments}
                    setCurrentView={handleSetCurrentView}
                    startEdit={handleStartEdit}
                    handleDelete={handleDelete}
                    isLoading={isLoading}
                    error={error} 
                />
            )}

            {currentView === 'form' && (
                <DepartmentForm
                    rolePermissions={rolePermissions}
                    setCurrentView={handleSetCurrentView}
                    currentDepartment={editingDepartment}
                    refreshList={fetchDepartments} 
                />
            )}
        </div>
    );
};

export default Departments;