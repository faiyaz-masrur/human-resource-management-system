import React, { useState, useEffect } from 'react';

// --- Permission Row Components (No changes here) ---

const AllPermissionRow = ({ title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            
            {['view', 'edit', 'create', 'delete'].map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        // Safely check the value, defaults to false if the permission doesn't exist for the section
                        checked={permissions[section]?.[permissionType] || false}
                        onChange={() => onChange(section, permissionType)}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);

const PermissionRow = ({ title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            
            {['view', 'edit', 'create'].map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        // Safely check the value, defaults to false if the permission doesn't exist for the section
                        checked={permissions[section]?.[permissionType] || false}
                        onChange={() => onChange(section, permissionType)}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);

const LimitedPermissionRow = ({ title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            
            {['view', 'edit'].map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        // Safely check the value, defaults to false if the permission doesn't exist for the section
                        checked={permissions[section]?.[permissionType] || false}
                        onChange={() => onChange(section, permissionType)}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);


const ViewOnlyPermissionRow = ({ title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            
            {['view'].map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        // Safely check the value, defaults to false if the permission doesn't exist for the section
                        checked={permissions[section]?.[permissionType] || false}
                        onChange={() => onChange(section, permissionType)}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);

// --- View Component 1: User Role Details / Edit View (Design 1) ---

const UserRoleDetailsView = ({ goToListView, roleId, roleData, updateRole }) => {
    
    // State for role details, initialized with props
    const [roleName, setRoleName] = useState(roleData?.name || "");
    const [status, setStatus] = useState(roleData?.status || "Active"); // Added status state
    
    const allPermissions = { view: false, edit: false, create: false, delete: false };
    const defaultPermissions = { view: false, edit: false, create: false };
    const limitedPermissions = { view: false, edit: false }; 
    const viewOnlyPermissions = { view: false }; 
    
    // Initial permissions state is now an empty object, will be populated below
    const [permissions, setPermissions] = useState({});

    // Use a temporary useEffect to initialize state based on the provided roleData/simulated permissions
    useEffect(() => {
        // Find the current role in roleData to initialize state
        const initialRole = roleData;
        if (initialRole) {
            setRoleName(initialRole.name);
            setStatus(initialRole.status);

            // This structure is based on the logic you had in the initial code,
            // which sets default permissions for all sections.
            setPermissions({
                // Employees Tab
                employees: { ...defaultPermissions }, 

                // My Profile Tab
                official_details: { ...defaultPermissions }, 
                personal_details: { ...defaultPermissions }, 
                addresses: { ...defaultPermissions }, 
                work_experiences: { ...defaultPermissions }, 
                education: { ...defaultPermissions }, 
                training_certificates: { ...defaultPermissions }, 
                attachmnets: { ...defaultPermissions }, 
                
                // Appraisal Tab
                review: { ...limitedPermissions }, 
                all_appraisal: { ...limitedPermissions },
                appraisal_status: { ...viewOnlyPermissions },

                employee: { ...defaultPermissions }, 
                rm: { ...defaultPermissions }, 
                hr: { ...defaultPermissions },
                hod: { ...defaultPermissions },
                coo: { ...defaultPermissions },
                ceo: { ...defaultPermissions },

                //Configurations Tab
                departments: { ...allPermissions },
                designations: { ...allPermissions },
                grades: { ...allPermissions },
                roles: { ...allPermissions },
            });
        }
    }, [roleData]); 


    const handleCheckboxChange = (section, permissionType) => {
        setPermissions(prevPermissions => {
            
            // Use the section's actual object or fall back to an empty object for safety
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

    const [activeTab, setActiveTab] = useState('My Profile'); 
    
    
    const handleSave = () => {
        const updatedRole = {
            id: roleId,
            name: roleName,
            status: status,
            // In a real app, you would also save the permissions object
            permissions: permissions, 
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, ''),
        };

        // Call the prop function to update the role in the parent state
        updateRole(updatedRole);

        console.log("--- Role Details Saved ---");
        console.log("Updated Role:", updatedRole);
        
        // Navigate back to the list view after saving
        goToListView(); 
    };

    // tabs array 
    const tabs = ['My Profile', 'My Appraisal', 'Employees', 'Review Appraisals', 'All Appraisals', 'Configurations']; 

    return (
        <div className="form-container urd-container">
            {/* Added back button to header */}
            <header className="urd-page-header">
                <button className="add-form-back-arrow" onClick={goToListView}>&larr;</button>
                User Role Details
            </header>

            <div className="urd-role-details-section">
                
                <div className="urd-detail-item">
                    <label className="urd-detail-label">User Role ID</label>
                    <input type="text" value={roleId || "R001"} readOnly className="urd-detail-input urd-role-id-input" />
                </div>
                <div className="urd-detail-item">
                    <label className="urd-detail-label">Role Name</label>
                    {/* Role name is now editable as requested */}
                    <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="urd-detail-input urd-role-name-input" />
                </div>
                {/* START: Status dropdown implementation */}
                <div className="urd-detail-item urd-status-dropdown-wrapper">
                    <label className="urd-detail-label">Status</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        // CHANGED CLASS: assuming this class helps manage the custom arrow
                        className="urd-detail-input urd-status-select" 
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                {/* END: Status dropdown implementation */}
            </div>

            <h3 className="urd-permissions-heading">Permissions</h3>

            <div className="urd-permissions-tabs-container">
                {tabs.map((tab) => (

                    <button key={tab} className={`urd-permission-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
            </div>

            <div className="urd-permissions-content">
                {activeTab === 'My Profile' && (
                    <div className="urd-agreement-permissions">
                        
                        <LimitedPermissionRow title="My Official Details" section="official_details" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Personal Details" section="personal_details" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Addresses" section="addresses" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Work Experiences" section="work_experiences" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Education" section="education" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Training & Certificates" section="training_certificates" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Attachments" section="attachmnets" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}

                {activeTab === 'Employees' && (
                    <div className="urd-agreement-permissions">
                        
                        <PermissionRow title="Employees" section="employees" permissions={permissions} onChange={handleCheckboxChange} />
                        
                        <PermissionRow title="Employee Official Details" section="official_details" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Personal Details" section="personal_details" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Addresses" section="addresses" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Work Experiences" section="work_experiences" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Education" section="education" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Training & Certificates" section="training_certificates" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Employee Attachments" section="attachmnets" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}

                
                {activeTab === 'My Appraisal' && (
                    <div className="urd-appraisal-permissions">
                        
                        <PermissionRow title="My Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="My CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}

                {activeTab === 'Review Appraisals' && (
                    <div className="urd-appraisal-permissions">
                        
                        <LimitedPermissionRow title="Review Appraisals" section="review" permissions={permissions} onChange={handleCheckboxChange} />
                        
                        <PermissionRow title="Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}


                {activeTab === 'All Appraisals' && (
                    <div className="urd-appraisal-permissions">
                        
                        <ViewOnlyPermissionRow title="Appraisal Status" section= "appraisal_status" permissions={permissions} onChange={handleCheckboxChange} />
                        <LimitedPermissionRow title="All Appraisals" section= "all_appraisal" permissions={permissions} onChange={handleCheckboxChange} />
                                                
                        <PermissionRow title="Employee Appraisal" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Reporting Manager Review" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HR Review" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HOD Review" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="COO Review" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="CEO Review" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}

                {activeTab === 'Configurations' && (
                    <div className="urd-appraisal-permissions">
                        
                        <AllPermissionRow title="Departments" section= "departments" permissions={permissions} onChange={handleCheckboxChange} />
                        <AllPermissionRow title="Designations" section= "designations" permissions={permissions} onChange={handleCheckboxChange} />
                        <AllPermissionRow title="Grades" section= "grades" permissions={permissions} onChange={handleCheckboxChange} />
                        <AllPermissionRow title="Roles" section= "roles" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}

            </div>

            <div className="urd-action-buttons">
                {/* Updated Save button to call handleSave */}
                <button className="urd-save-button" onClick={handleSave}>Save</button>
                <button className="urd-back-button" onClick={goToListView}>Back</button>
            </div>
        </div>
    );
};

// --- View Component 2: Add New Role (No changes here) ---

const AddNewRoleView = ({ goToListView, addRole }) => {
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = (action) => {
        // Simple logic for adding a new role with a unique ID
        const newRoleId = 'R-' + (Math.floor(Math.random() * 1000) + 1000).toString(); // Unique-ish ID
        const newRole = {
            id: newRoleId,
            name: name || 'New Role',
            status: 'Active',
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, ''),
        };

        addRole(newRole); // Add to parent state

        console.log(`Saving role with action: ${action}`, newRole);
        
        if (action === 'save') {
            goToListView(); 
        } else if (action === 'add_another') {
            setName('');
            setDescription('');
        }
    };

    return (
        <div className="form-container add-form-container">
            <header className="add-form-header">
                {/* The arrow acts as the "Back" action */}
                <button className="add-form-back-arrow" onClick={goToListView}>&larr;</button>
                Add Role
            </header>

            <div className="add-form-card">
                <div className="add-form-info-header">Basic Info</div>
                <div className="add-form-field">
                    <label className="add-form-label">Name:</label>
                    <input
                        type="text"
                        placeholder="Enter role name"
                        className="add-form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="add-form-field">
                    <label className="add-form-label">Description:</label>
                    <textarea
                        placeholder="Provide a detailed description of the role's responsibilities"
                        className="add-form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="add-form-action-buttons">
                <button className="add-form-save-button" onClick={() => handleSave('save')}>SAVE</button>
                <button className="add-form-secondary-button" onClick={() => handleSave('add_another')}>Save and add another</button>
                <button className="add-form-secondary-button" onClick={() => handleSave('continue_editing')}>Save and continue editing</button>
            </div>
        </div>
    );
};

// --- View Component 3: All Roles / List View (No changes here) ---

const AllRolesView = ({ openDetailsView, openCreateView, roles, setRoles }) => {
    
    // Using the 'roles' state passed from the parent component
    const [roleNameFilter, setRoleNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleSearch = () => {
        console.log("Searching with filters:", { roleNameFilter, statusFilter });
    };

    const handleDelete = (roleId, roleName) => {
        if (window.confirm(`Are you sure you want to delete the role "${roleName}" (${roleId})?`)) {
            setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId));
            console.log(`Deleted role: ${roleId}`);
        }
    };

    // Filter logic to display the roles based on input
    const filteredRoles = roles.filter(role => {
        const nameMatch = role.name.toLowerCase().includes(roleNameFilter.toLowerCase());
        const statusMatch = statusFilter === '' || role.status === statusFilter;
        return nameMatch && statusMatch;
    });

    return (
        <div className="ar-container">
            <header className="ar-header">
                <h1 className="ar-title">All Roles</h1>
                <button className="ar-add-new-button" onClick={openCreateView}>
                    <span className="ar-plus-icon">+</span> Add New
                </button>
            </header>

            <div className="ar-search-filters-section">
                <div className="ar-filter-item">
                    <label className="ar-filter-label">Role Name</label>
                    <input type="text" placeholder="Enter User Role Name" className="ar-filter-input" value={roleNameFilter} onChange={(e) => setRoleNameFilter(e.target.value)} />
                </div>
                <div className="ar-filter-item">
                    <label className="ar-filter-label">Status</label>
                    <select className="ar-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">-- Select --</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <button className="ar-search-button" onClick={handleSearch}>Search</button>
            </div>

            <div className="ar-table-container">
                <table className="ar-roles-table">
                    <thead>
                        <tr><th>Role ID</th><th>Role Name</th><th>Status</th><th>Last Modified</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredRoles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td><span className={`ar-status-badge ${role.status.toLowerCase()}`}>{role.status}</span></td>
                                <td>{role.date}</td>
                                <td>
                                    <div className="ar-actions-cell">
                                        {/* START: Updated Actions with Edit (Pen) and Delete (Trash) */}
                                        <button 
                                            className="action-button-light action-button--edit-light" 
                                            onClick={() => openDetailsView(role.id)}
                                            title="Edit Role"
                                        >
                                            &#9998; {/* Pen emoji for Edit */}
                                        </button>
                                        <button 
                                            className="action-button-light action-button--delete-light" 
                                            onClick={() => handleDelete(role.id, role.name)}
                                            title="Delete Role"
                                        >
                                            &#128465; {/* Trash emoji for Delete */}
                                        </button>
                                        {/* END: Updated Actions */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRoles.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>No roles found matching the current filters.</p>}
            </div>
        </div>
    );
};

// ===============================================
// Main Component to Manage State and Render Views
// ===============================================

const Roles = () => {
    
    const initialRoles = [
        { id: 'R-003', name: 'Employee', status: 'Active', date: '02 Mar 2025' },
        { id: 'R-002', name: 'HR', status: 'Inactive', date: '23 Feb 2022' },
        { id: 'R-001', name: 'CEO', status: 'Active', date: '19 Apr 2025' },
    ];

    // Role state is now in the parent component
    const [roles, setRoles] = useState(initialRoles); 
    const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'create'
    const [selectedRoleId, setSelectedRoleId] = useState(null); // ID of role being viewed/edited

    // Function to update an existing role
    const updateRole = (updatedRole) => {
        setRoles(prevRoles => 
            prevRoles.map(role => 
                role.id === updatedRole.id ? { ...role, name: updatedRole.name, status: updatedRole.status, date: updatedRole.date } : role
            )
        );
    };

    // Function to add a new role (for AddNewRoleView)
    const addRole = (newRole) => {
        setRoles(prevRoles => [newRole, ...prevRoles]);
    };

    const openDetailsView = (id) => {
        setSelectedRoleId(id);
        setCurrentView('details');
    };

    const openCreateView = () => {
        setCurrentView('create');
    };

    const goToListView = () => {
        setSelectedRoleId(null);
        setCurrentView('list');
    };

    const renderView = () => {
        const roleToEdit = roles.find(role => role.id === selectedRoleId);

        switch (currentView) {
            case 'list':
                // Pass roles and setRoles to AllRolesView
                return <AllRolesView 
                            openDetailsView={openDetailsView} 
                            openCreateView={openCreateView} 
                            roles={roles}
                            setRoles={setRoles} // Allows AllRolesView to handle its own delete
                        />;
            case 'details':
                // Pass the specific role data and the update function
                return <UserRoleDetailsView 
                            goToListView={goToListView} 
                            roleId={selectedRoleId}
                            roleData={roleToEdit} // Pass the role object
                            updateRole={updateRole}
                        />;
            case 'create':
                return <AddNewRoleView goToListView={goToListView} addRole={addRole} />;
            default:
                return <AllRolesView 
                            openDetailsView={openDetailsView} 
                            openCreateView={openCreateView} 
                            roles={roles}
                            setRoles={setRoles}
                        />;
        }
    };

    return (
        <div className="role-manager-app">
            {renderView()}
        </div>
    );
};

export default Roles;