import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';

const ROLES_API_URL = 'system/configurations/roles/'; 

const PERMISSIONS_API_URL = 'system/role-permissions/'; 


const PermissionRow = ({ rolePermissions, title, section, permissions, onChange, permissionTypes }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {permissionTypes.map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        checked={permissions[section]?.[permissionType] || false}
                        onChange={() => onChange(section, permissionType)}
                        disabled={!rolePermissions.edit}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);

const UserRoleDetailsView = ({ rolePermissions, goToListView, currentRole, refreshList }) => {
    
    const [role, setRole] = useState(currentRole || {});
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [activeTab, setActiveTab] = useState('My Profile'); 
    

    const mapListToObj = (rolePermissionsList) => {
        return rolePermissionsList.reduce((accumulator, rolePermissionObj) => {
            accumulator[rolePermissionObj.sub_workspace] = rolePermissionObj
            return accumulator;
        }, {});
    };


    const fetchRoleData = useCallback(async (roleId) => {
        if (!roleId) return;
        setLoading(true);
        try {
            if(rolePermissions.view){
                const res = await api.get(`${PERMISSIONS_API_URL}${roleId}/`); 
                console.log("Role permission List:", res?.data);
                setPermissions(mapListToObj(res?.data)|| {});
            }
        } catch (err) {
            console.error("Error fetching role permissions:", err);
            setPermissions({});
        } finally {
            setLoading(false);
        }
    }, [rolePermissions]);


    useEffect(() => {
        if (role?.id) {
            fetchRoleData(role.id);
        }
    }, [rolePermissions]); 
    
    
    const handleCheckboxChange = (section, permissionType) => {
        setPermissions(prevPermissions => {
            const currentSection = prevPermissions[section] || {};
            if(currentSection){
                return {
                    ...prevPermissions,
                    [section]: {
                        ...currentSection,
                        [permissionType]: !currentSection[permissionType],
                    },
                };
            }
        });
    };


    const handleChange = (field, value) => {
        setRole((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if(!rolePermissions.edit){
            alert("You don't have permission to edit.");
            return;
        }
        setLoading(true);
        try {
            const roleResponse = await api.put(`${ROLES_API_URL}${role.id}/`, role);
            if(roleResponse.status === 200){
                console.log("Updated role:", roleResponse)
                const rolePermissionsList = Object.values(permissions);
                const updatePromises = rolePermissionsList.map(permission => 
                    api.put(`${PERMISSIONS_API_URL}${permission.id}/`, permission)
                );
                
                const permissionsResponses = await Promise.all(updatePromises);
                const allSuccessful = permissionsResponses.every(res => res.status === 200);
                if(allSuccessful){
                    toast.success(`Role "${role.name}" and permissions updated successfully.`);
                    refreshList(); 
                    goToListView();
                } else {
                    console.log("Failed to updated role permissions:", permissionsResponses)
                    toast.error("Failed to save role permissions.");
                }
            } else {
                console.log("Failed to updated role:", roleResponse)
                toast.error("Failed to update role.");
            } 
        } catch (err) {
            console.error("Failed to update role or permissions:", err);
            toast.error("Failed to update role or permissions.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['My Profile', 'Employees', 'My Appraisal', 'Review Appraisals', 'All Appraisals', 'Configurations']; 
    
    // Find the original role data for ID display
    const roleId = role.id || "N/A";

    return (
        <div className="form-container urd-container">
            <header className="urd-page-header">
                <button className="add-form-back-arrow" onClick={goToListView} disabled={loading}>&larr;</button>
                Role Details: {currentRole?.name || "Loading..."}
            </header>

            <div className="urd-role-details-section">
                
                <div className="urd-detail-item">
                    <label className="urd-detail-label">User Role ID</label>
                    <input 
                        type="text" 
                        value={roleId} 
                        className="urd-detail-input urd-role-id-input"
                        readOnly
                    />
                </div>

                <div className="urd-detail-item">
                    <label className="urd-detail-label">Role Name</label>
                    <input 
                        type="text" 
                        value={role.name} 
                        onChange={(e) => handleChange("name", e.target.value)} 
                        className="urd-detail-input urd-role-name-input" 
                        disabled={loading || !rolePermissions.edit} 
                    />
                </div>
                <div className="urd-detail-item urd-status-dropdown-wrapper">
                    <label className="urd-detail-label">Status</label>
                    <select 
                        value={role.status} 
                        onChange={(e) => handleChange("status", e.target.value)} 
                        className="urd-detail-input urd-status-select" 
                        disabled={loading || !rolePermissions.edit}
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>
                <div className="urd-detail-item">
                    <label className="urd-detail-label">Description</label>
                    <textarea 
                        value={role.description} 
                        onChange={(e) => handleChange("description", e.target.value)} 
                        className="urd-detail-input urd-description-input" 
                        disabled={loading || !rolePermissions.edit}
                    >
                    </textarea>
                </div>
            </div>


            <h3 className="urd-permissions-heading">Permissions</h3>

            {loading ? (
                <div style={{textAlign: 'center', padding: '20px'}}>Loading permissions...</div>
            ) : (
                <>
                    <div className="urd-permissions-tabs-container">
                        {tabs.map((tab) => (
                            <button 
                                key={tab} 
                                className={`urd-permission-tab ${activeTab === tab ? 'active' : ''}`} 
                                onClick={() => setActiveTab(tab)} 
                                disabled={loading}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="urd-permissions-content">
                        {activeTab === 'My Profile' && (
                            <div className="urd-agreement-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Official Details" 
                                    section="MyOfficialDetail" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Personal Details" 
                                    section="MyPersonalDetail" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Addresses" 
                                    section="MyAddress" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Work Experiences" 
                                    section="MyWorkExperience" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Education" 
                                    section="MyEducation" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Training & Certificates" 
                                    section="MyTrainingCertificate" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Attachments" 
                                    section="MyAttachment" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                            </div>
                        )}

                        {activeTab === 'Employees' && (
                            <div className="urd-agreement-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee List" 
                                    section="EmployeeList" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Official Details" 
                                    section="EmployeeOfficialDetail" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Personal Details" 
                                    section="EmployeePersonalDetail" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Addresses" 
                                    section="EmployeeAddress" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Work Experiences" 
                                    section="EmployeeWorkExperience" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Education" 
                                    section="EmployeeEducation" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Training & Certificates" 
                                    section="EmployeeTrainingCertificate" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Attachments" 
                                    section="EmployeeAttachment" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit', 'delete']} 
                                />
                            </div>
                        )}
                        
                        {activeTab === 'My Appraisal' && (
                            <div className="urd-appraisal-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Employee Appraisal" 
                                    section="MyEmployeeAppraisal" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My Reporting Manager Review" 
                                    section="MyRmReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My HR Review" 
                                    section="MyHrReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My HOD Review" 
                                    section="MyHodReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My COO Review" 
                                    section="MyCooReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="My CEO Review" 
                                    section="MyCeoReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                            </div>
                        )}

                        {activeTab === 'Review Appraisals' && (
                            <div className="urd-appraisal-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Review Appraisal List" 
                                    section="ReviewAppraisalList" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Appraisal" 
                                    section="EmployeeEmployeeAppraisal" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Reporting Manager Review" 
                                    section="EmployeeRmReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="HR Review" 
                                    section="EmployeeHrReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="HOD Review" 
                                    section="EmployeeHodReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="COO Review" 
                                    section="EmployeeCooReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="CEO Review" 
                                    section="EmployeeCeoReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                            </div>
                        )}

                        {activeTab === 'All Appraisals' && (
                            <div className="urd-appraisal-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Appraisal Status" 
                                    section= "AppraisalStatus" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="All Appraisal List" 
                                    section= "AllAppraisalList" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Employee Appraisal" 
                                    section="AllEmployeeAppraisal" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Reporting Manager Review" 
                                    section="AllRmReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="HR Review" 
                                    section="AllHrReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="HOD Review" 
                                    section="AllHodReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="COO Review" 
                                    section="AllCooReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="CEO Review" 
                                    section="AllCeoReview" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange}
                                    permissionTypes={['view', 'create', 'edit']} 
                                />
                            </div>
                        )}

                        {activeTab === 'Configurations' && (
                            <div className="urd-appraisal-permissions">
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Departments" 
                                    section= "Department" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Designations" 
                                    section= "Designation" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Grades" 
                                    section= "Grade" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                                <PermissionRow 
                                    rolePermissions={rolePermissions} 
                                    title="Roles" 
                                    section= "Role" 
                                    permissions={permissions} 
                                    onChange={handleCheckboxChange} 
                                    permissionTypes={['view', 'create', 'edit', 'delete']}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="urd-action-buttons">
                {rolePermissions.edit && (
                    <button 
                        className="urd-save-button" 
                        onClick={handleSave} 
                        disabled={loading || !role.name}
                    >
                        {loading ? "SAVING..." : "SAVE"}
                    </button>
                )}
                <button className="urd-back-button" onClick={goToListView} disabled={loading}>Back</button>
            </div>
        </div>
    );
};

// --- View Component 2: Add New Role (API Integrated) ---

const AddNewRoleView = ({ rolePermissions, goToListView, refreshList }) => {
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async (action) => {
        if(!rolePermissions.create){
            alert("You don't have permission to create.");
            return;
        }
        setLoading(true);
        try {
            const dataToSend = {
                name: name,
                description: description || null,
                status: true, 
            };
            
            const res = await api.post(ROLES_API_URL, dataToSend);
            toast.success(`Role "${res.data.name}" added successfully!`);
            
            await refreshList();
            
            if (action === 'save') {
                goToListView(); 
            } else if (action === 'add_another') {
                setName('');
                setDescription('');
            }
            
        } catch (err) {
            console.error("Failed to create role:", err);
            toast.error("Failed to create role.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-container add-form-container">
            <header className="add-form-header">
                <button className="add-form-back-arrow" onClick={goToListView} disabled={loading}>&larr;</button>
                Add Role
            </header>

            <div className="add-form-card">
                <div className="add-form-info-header">Basic Info</div>
                <div className="add-form-field">
                    <label className="add-form-label">Name:*</label>
                    <input
                        type="text"
                        placeholder="Enter role name"
                        className="add-form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading || !rolePermissions.create}
                        required
                    />
                </div>
                <div className="add-form-field">
                    <label className="add-form-label">Description:</label>
                    <textarea
                        placeholder="Provide a detailed description of the role's responsibilities"
                        className="add-form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading || !rolePermissions.create}
                    />
                </div>
            </div>

            {rolePermissions.create && (
                <div className="add-form-action-buttons">
                    <button className="add-form-save-button" onClick={() => handleSave('save')} disabled={loading || !name}>
                        {loading ? "SAVING..." : "SAVE"}
                    </button>
                    <button className="add-form-secondary-button" onClick={() => handleSave('add_another')} disabled={loading || !name}>
                        Save and add another
                    </button>
                </div>
            )}
        </div>
    );
};


// --- View Component 3: All Roles / List View (API Integrated) ---

const AllRolesView = ({ rolePermissions, openDetailsView, openCreateView, roles, handleDelete, isLoading, error }) => {
    
    const [roleNameFilter, setRoleNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredRoles = roles.filter(role => {
        const nameMatch = role.name.toLowerCase().includes(roleNameFilter.toLowerCase());
        const statusMatch = statusFilter === '' || role.status === statusFilter;
        return nameMatch && statusMatch;
    });

    return (
        <div className="ar-container">
            <header className="ar-header">
                <h1 className="ar-title">All Roles</h1>
                {rolePermissions.create && (
                    <button className="ar-add-new-button" onClick={openCreateView} disabled={isLoading}>
                        <span className="ar-plus-icon">+</span> Add New
                    </button>
                )}
            </header>
            
            {rolePermissions.view && (
                <div className="ar-search-filters-section">
                    <div className="ar-filter-item">
                        <label className="ar-filter-label">Role Name</label>
                        <input type="text" placeholder="Enter User Role Name" className="ar-filter-input" value={roleNameFilter} onChange={(e) => setRoleNameFilter(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="ar-filter-item">
                        <label className="ar-filter-label">Status</label>
                        <select className="ar-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} disabled={isLoading}>
                            <option value="">-- Select --</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    {/* <button className="ar-search-button" onClick={() => {}}>Search</button> */}
                </div>
            )}

            {error ? (
                <div className="error-message p-4 bg-red-100 text-red-700 border border-red-400 rounded mt-4">{error}</div>
            ) : isLoading ? (
                <div className="loading-message" style={{textAlign: 'center', padding: '20px'}}>
                    Loading roles...
                </div>
            ) : (
                <div className="ar-table-container">
                    <table className="ar-roles-table">
                        <thead>
                            <tr><th>Role ID</th><th>Role Name</th><th>Status</th><th>Last Modified</th>{(rolePermissions.edit || rolePermissions.delete) && <th>Actions</th>}</tr>
                        </thead>
                        <tbody>
                            {filteredRoles.length > 0 ? (
                                filteredRoles.map((role) => (
                                    <tr key={role.id}>
                                        <td>{role.id}</td>
                                        <td>{role.name}</td>
                                        <td><span className={`ar-status-badge ${role.status.toLowerCase()}`}>{role.status}</span></td>
                                        {/* Assuming your API provides a last_modified or date field */}
                                        <td>{new Date(role.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '')}</td>
                                        {(rolePermissions.edit || rolePermissions.delete) && (
                                            <td>
                                                <div className="ar-actions-cell">
                                                    {rolePermissions.edit && (
                                                        <button 
                                                            className="action-button-light action-button--edit-light" 
                                                            onClick={() => openDetailsView(role.id)}
                                                            title="Edit Role"
                                                        >
                                                            &#9998;
                                                        </button>
                                                    )}

                                                    {rolePermissions.delete && (
                                                        <button 
                                                            className="action-button-light action-button--delete-light" 
                                                            onClick={() => handleDelete(role.id, role.name)}
                                                            title="Delete Role"
                                                        >
                                                            &#128465;
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-data-message" style={{textAlign: 'center', padding: '20px'}}>
                                        {roleNameFilter || statusFilter ? "No roles match your search criteria." : "No roles."}
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


// ===============================================
// Main Component to Manage State and Render Views (API Integrated)
// ===============================================

const Roles = () => {
    const { user } = useAuth();
    const [roles, setRoles] = useState([]); 
    const [currentView, setCurrentView] = useState('list');
    const [selectedRoleId, setSelectedRoleId] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rolePermissions, setRolePermissions] = useState({});


    useEffect(() => {
        const fetchRolePermissions = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`system/role-permissions/${user.role}/${"Configuration"}/${"Role"}/`)
                console.log("User role permission:", res?.data)
                setRolePermissions(res?.data || {}); 
            } catch (error) {
                console.warn("Error fatching role permissions", error);
                setRolePermissions({}); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchRolePermissions();
    }, []);


    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if(rolePermissions.view){
                const res = await api.get(ROLES_API_URL);
                // Assuming your API returns a list of roles with id, name, status, and a date field
                setRoles(res.data.map(role => ({
                    ...role,
                    status: role.status || 'Active', // Default if API misses it
                    date: role.date || new Date().toISOString().split('T')[0], // Use a date field from API
                })));
            }
        } catch (err) {
            console.error("Fetch error:", err.response || err);
            setError("Failed to load roles. Please check the API server and network.");
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    }, [rolePermissions]); 


    useEffect(() => {
        fetchRoles();
    }, [rolePermissions]); 


    const handleDelete = async (id, name) => {
        if(!rolePermissions.delete){
            alert("You don't have permission to delete.")
            return;
        }
        if (window.confirm(`Are you sure you want to delete the role: "${name}"?`)) {
            setIsLoading(true); 
            try {
                await api.delete(`${ROLES_API_URL}${id}/`);
                toast.success(`Role "${name}" deleted successfully.`);
                setRoles(roles.filter(role => role.id !== id));
            } catch (err) {
                console.error("Delete error:", err.response ? err.response.data : err.message);
                const message = err.response?.data?.detail || "It might be associated with employees or other data.";
                toast.error(`Failed to delete role. ${message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };
    

    const openDetailsView = (id) => {
        if (rolePermissions.view){
            setSelectedRoleId(id);
            setCurrentView('details');
        } else {
            alert("You don't have permission to view.")
        }
    };


    const openCreateView = () => {
        if (rolePermissions.create){
            setCurrentView('create');
        } else {
            alert("You don't have permission to create.")
        }
    };

    const goToListView = () => {
        setSelectedRoleId(null);
        setCurrentView('list');
        // Re-fetch list to ensure latest data is displayed after save/delete
        fetchRoles();
    };

    const renderView = () => {
        // Find the current role data to pass to the details view
        const roleToEdit = roles.find(role => role.id === selectedRoleId);

        switch (currentView) {
            case 'list':
                return <AllRolesView 
                            rolePermissions={rolePermissions}
                            openDetailsView={openDetailsView} 
                            openCreateView={openCreateView} 
                            roles={roles}
                            handleDelete={handleDelete}
                            isLoading={isLoading}
                            error={error}
                        />;
            case 'details':
                return <UserRoleDetailsView 
                            rolePermissions={rolePermissions}
                            goToListView={goToListView} 
                            currentRole={roleToEdit} // Pass the full role object
                            refreshList={fetchRoles} // Pass the fetch function to update the list after saving
                        />;
            case 'create':
                return <AddNewRoleView 
                            rolePermissions={rolePermissions} 
                            goToListView={goToListView} 
                            refreshList={fetchRoles} 
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="role-manager-app">
            {renderView()}
        </div>
    );
};

export default Roles;