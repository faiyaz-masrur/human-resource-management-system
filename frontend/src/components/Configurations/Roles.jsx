import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';

const ROLES_API_URL = 'system/configurations/roles/'; 

const PERMISSIONS_API_URL = 'system/role-permissions/'; 


const SECTION_TO_SUB_WORKSPACE_MAP = {
    // My Profile Tab
    official_details: 'My OfficialDetail', 
    personal_details: 'My PersonalDetail',
    addresses: 'My Address',
    work_experiences: 'My WorkExperience',
    education: 'My Education',
    training_certificates: 'My ProfessionalCertificate',
    attachmnets: 'My Attachment',
    
    // Employees Tab
    employees: 'Employee',
    
    // Appraisal Tab (My Appraisal, Review Appraisals, All Appraisals)
    review: 'Review Appraisal', 
    all_appraisal: 'All Appraisal',
    appraisal_status: 'Appraisal Status',
    
    // Appraisal Review Steps (Used in My/Review/All Appraisals)
    employee: 'Employee Appraisal',
    rm: 'Reporting Manager Review',
    hr: 'HR Review',
    hod: 'HOD Review',
    coo: 'COO Review',
    ceo: 'CEO Review',
    
    // Configurations Tab
    departments: 'Department', 
    designations: 'Designation', 
    grades: 'Grade', 
    roles: 'Role', 
};

// --- Permission Row Components (No changes here, just kept for completeness) ---

const AllPermissionRow = ({ rolePermissions, title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {['view', 'edit', 'create', 'delete'].map((permissionType) => (
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

const PermissionRow = ({ rolePermissions, title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {['view', 'edit', 'create'].map((permissionType) => (
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

const LimitedPermissionRow = ({ rolePermissions, title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {['view', 'edit'].map((permissionType) => (
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


const ViewOnlyPermissionRow = ({ rolePermissions, title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {['view'].map((permissionType) => (
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

// --- View Component 1: User Role Details / Edit View (API Integrated) ---

const UserRoleDetailsView = ({ rolePermissions, goToListView, currentRole, refreshList }) => {
    
    const [roleName, setRoleName] = useState(currentRole?.name || "");
    const [description, setDescription] = useState(currentRole?.description || "");
    const [status, setStatus] = useState(currentRole?.status || "Active"); 
    const [loading, setLoading] = useState(false);
    
    // Holds permissions state: { section: { view: bool, create: bool, edit: bool, delete: bool, id: optional_int } }
    const [permissions, setPermissions] = useState({});
    
    // Store the raw list of permissions from the API to correctly handle POST/PUT logic
    const [initialPermissions, setInitialPermissions] = useState([]); 

    const [activeTab, setActiveTab] = useState('My Profile'); 
    
    // --- Mappers ---

    // Map raw API data (list of permission objects) to nested state object
    const mapApiToState = (apiPermissions) => {
        return apiPermissions.reduce((acc, p) => {
            // Find the frontend section key (e.g., 'official_details') that matches the backend sub_workspace value (e.g., 'Official Details')
            const section = Object.keys(SECTION_TO_SUB_WORKSPACE_MAP).find(key => 
                SECTION_TO_SUB_WORKSPACE_MAP[key] === p.sub_workspace
            );
            
            if (section) {
                acc[section] = {
                    view: p.view,
                    create: p.create,
                    edit: p.edit,
                    delete: p.delete,
                    id: p.id // Crucial: Keep the permission ID for updates
                };
            }
            return acc;
        }, {});
    };

    // Map nested state object back to raw API data (list for batch update)
    const mapStateToApi = (roleId, statePermissions) => {
        const permissionsToSave = [];
        
        Object.entries(statePermissions).forEach(([section, perms]) => {
            const sub_workspace = SECTION_TO_SUB_WORKSPACE_MAP[section];
            if (!sub_workspace) return;

            // Only include permissions where at least one action is true, or if it's an existing permission (p.id)
            if (perms.view || perms.create || perms.edit || perms.delete || perms.id) {
                permissionsToSave.push({
                    ...(perms.id && { id: perms.id }), 
                    role: roleId,
                    workspace: "Configuration", // Hardcoded based on common Django setups
                    sub_workspace: sub_workspace,
                    view: perms.view || false,
                    create: perms.create || false,
                    edit: perms.edit || false,
                    delete: perms.delete || false,
                });
            }
        });
        
        return permissionsToSave;
    };


    // --- Fetch Role Details & Permissions ---
    const fetchRoleData = useCallback(async (roleId) => {
        if (!roleId) return;
        setLoading(true);
        try {
            // 1. Fetch Role Details (Optional: if the list view doesn't have all details)
            // const roleRes = await api.get(`${ROLES_API_URL}${roleId}/`);
            // setRoleName(roleRes.data.name);
            // setDescription(roleRes.data.description);

            // 2. Fetch Role Permissions
            // Assuming your endpoint supports filtering by role ID using a query parameter
            if(rolePermissions.view){
                const permRes = await api.get(PERMISSIONS_API_URL, {
                    params: { role: roleId } 
                }); 
                
                setInitialPermissions(permRes.data);
                setPermissions(mapApiToState(permRes.data));
            }
        } catch (err) {
            console.error("Error fetching role data/permissions:", err.response || err);
            toast.error("Failed to load role details or permissions.");
            
            // On error, initialize permissions to empty structure to prevent crashes
            const emptyPermissions = Object.fromEntries(
                Object.keys(SECTION_TO_SUB_WORKSPACE_MAP).map(key => [key, {}])
            );
            setPermissions(emptyPermissions);

        } finally {
            setLoading(false);
        }
    }, [rolePermissions]);


    useEffect(() => {
        // Initialize basic role info from props
        setRoleName(currentRole?.name || "");
        setDescription(currentRole?.description || "");
        setStatus(currentRole?.status || "Active");

        if (currentRole?.id) {
            fetchRoleData(currentRole.id);
        }
    }, [currentRole, rolePermissions]); 
    
    
    // --- Permission Checkbox Handler (Unchanged) ---
    const handleCheckboxChange = (section, permissionType) => {
        setPermissions(prevPermissions => {
            const currentSection = prevPermissions[section] || {};
            return {
                ...prevPermissions,
                [section]: {
                    ...currentSection,
                    [permissionType]: !currentSection[permissionType],
                },
            };
        });
    };

    // --- Save Handler ---
    const handleSave = async () => {
        if(!rolePermissions.edit){
            alert("You don't have permission to edit.");
            return;
        }
        setLoading(true);
        
        try {
            // 1. Update the Role (Name, Description, Status)
            const roleData = {
                name: roleName,
                description: description || null,
                status: status,
                // Add any other top-level role fields here
            };
            
            // PUT request to update the main role object
            await api.put(`${ROLES_API_URL}${currentRole.id}/`, roleData);

            // 2. Update the Permissions
            const permissionsToSave = mapStateToApi(currentRole.id, permissions);

            // Process permissions: POST for new ones (no ID), PUT for existing ones (has ID)
            const permissionPromises = permissionsToSave.map(p => {
                // Check if the permission object was originally fetched from the API (has an ID)
                if (p.id) {
                    // Existing permission, send PUT/PATCH
                    return api.put(`${PERMISSIONS_API_URL}${p.id}/`, p);
                } else if (p.view || p.create || p.edit || p.delete) {
                    // New permission with at least one flag set, send POST
                    return api.post(PERMISSIONS_API_URL, p);
                }
                return null; // Skip if it's new and all flags are false
            }).filter(p => p !== null);

            await Promise.all(permissionPromises);
            
            toast.success(`Role "${roleName}" and permissions updated successfully.`);
            
            refreshList(); // Update the list view
            goToListView(); 
            
        } catch (err) {
            console.error("Save error:", err.response ? err.response.data : err.message);
            let errorMessage = "Failed to save role or permissions.";
            if (err.response?.data?.name) {
                errorMessage = `Error: Role Name ${err.response.data.name[0]}`;
            }
            toast.error(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['My Profile', 'My Appraisal', 'Employees', 'Review Appraisals', 'All Appraisals', 'Configurations']; 
    
    // Find the original role data for ID display
    const roleId = currentRole?.id || "N/A";

    return (
        <div className="form-container urd-container">
            <header className="urd-page-header">
                <button className="add-form-back-arrow" onClick={goToListView} disabled={loading}>&larr;</button>
                User Role Details: {currentRole?.name || "Loading..."}
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
                        value={roleName} 
                        onChange={(e) => setRoleName(e.target.value)} 
                        className="urd-detail-input urd-role-name-input" 
                        disabled={loading || !rolePermissions.edit} 
                    />
                </div>
                <div className="urd-detail-item urd-status-dropdown-wrapper">
                    <label className="urd-detail-label">Status</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="urd-detail-input urd-status-select" 
                        disabled={loading || !rolePermissions.edit}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="urd-detail-item">
                    <label className="urd-detail-label">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
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
                                <LimitedPermissionRow rolePermissions={rolePermissions} title="My Official Details" section="official_details" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Personal Details" section="personal_details" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Addresses" section="addresses" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Work Experiences" section="work_experiences" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Education" section="education" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Training & Certificates" section="training_certificates" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Attachments" section="attachmnets" permissions={permissions} onChange={handleCheckboxChange} />
                            </div>
                        )}

                        {activeTab === 'Employees' && (
                            <div className="urd-agreement-permissions">
                                <PermissionRow rolePermissions={rolePermissions} title="Employees" section="employees" permissions={permissions} onChange={handleCheckboxChange} />
                                {/* IMPORTANT: Using same section keys here for employee details means they share permissions with "My Profile" tab. Adjust keys if you need separate permissions for viewing 'My Official Details' vs. 'Employee Official Details'. */}
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Official Details" section="official_details" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Personal Details" section="personal_details" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Addresses" section="addresses" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Work Experiences" section="work_experiences" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Education" section="education" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Training & Certificates" section="training_certificates" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Attachments" section="attachmnets" permissions={permissions} onChange={handleCheckboxChange} />
                            </div>
                        )}
                        
                        {activeTab === 'My Appraisal' && (
                            <div className="urd-appraisal-permissions">
                                <PermissionRow rolePermissions={rolePermissions} title="My Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="My CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                            </div>
                        )}

                        {activeTab === 'Review Appraisals' && (
                            <div className="urd-appraisal-permissions">
                                <LimitedPermissionRow rolePermissions={rolePermissions} title="Review Appraisals" section="review" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                            </div>
                        )}

                        {activeTab === 'All Appraisals' && (
                            <div className="urd-appraisal-permissions">
                                <ViewOnlyPermissionRow rolePermissions={rolePermissions} title="Appraisal Status" section= "appraisal_status" permissions={permissions} onChange={handleCheckboxChange} />
                                <LimitedPermissionRow rolePermissions={rolePermissions} title="All Appraisals" section= "all_appraisal" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                                <PermissionRow rolePermissions={rolePermissions} title="CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                            </div>
                        )}

                        {activeTab === 'Configurations' && (
                            <div className="urd-appraisal-permissions">
                                <AllPermissionRow rolePermissions={rolePermissions} title="Departments" section= "departments" permissions={permissions} onChange={handleCheckboxChange} />
                                <AllPermissionRow rolePermissions={rolePermissions} title="Designations" section= "designations" permissions={permissions} onChange={handleCheckboxChange} />
                                <AllPermissionRow rolePermissions={rolePermissions} title="Grades" section= "grades" permissions={permissions} onChange={handleCheckboxChange} />
                                <AllPermissionRow rolePermissions={rolePermissions} title="Roles" section= "roles" permissions={permissions} onChange={handleCheckboxChange} />
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
                        disabled={loading || !roleName}
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
                status: 'Active', // Default status for a new role
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
            console.error("Save error:", err.response ? err.response.data : err.message);
            let errorMessage = "Failed to create role.";
            if (err.response?.data?.name) {
                errorMessage = `Error: Role Name ${err.response.data.name[0]}`;
            }
            toast.error(errorMessage);
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
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
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
                const res = await api.get(`system/role-permissions/${user.role}/${"Configuration"}/${"Role"}/`)
                console.log("User role permission:", res?.data)
                setRolePermissions(res?.data || {}); 
            } catch (error) {
                console.warn("Error fatching role permissions", error);
                setRolePermissions({}); 
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