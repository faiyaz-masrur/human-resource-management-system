import React, { useState } from 'react';

// --- Helper Component: Permission Checkbox Row ---

const PermissionRow = ({ title, section, permissions, onChange }) => (
    <div className="urd-permission-row">
        <h4 className="urd-permission-title">{title}</h4>
        <div className="urd-permission-checkboxes">
            {['view', 'edit', 'delete', 'create'].map((permissionType) => (
                <label key={permissionType} className="urd-permission-label">
                    <input
                        type="checkbox"
                        checked={permissions[section][permissionType]}
                        onChange={() => onChange(section, permissionType)}
                    />
                    {permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}
                </label>
            ))}
        </div>
    </div>
);

// --- View Component 1: User Role Details / Edit View (Design 1) ---

const UserRoleDetailsView = ({ goToListView, roleId }) => {
    // State to mimic the data being edited/viewed (using fixed data from image 1 for simplicity)
    const [activeTab, setActiveTab] = useState('Agreement');
    const [permissions, setPermissions] = useState({
        agreements: { view: true, edit: false, delete: false, create: false },
        agreementType: { view: true, edit: false, delete: false, create: false },
        agreementCategory: { view: true, edit: false, delete: false, create: false },
        agreementParty: { view: true, edit: false, delete: false, create: false },
    });

    const handleCheckboxChange = (section, permissionType) => {
        setPermissions(prevPermissions => ({
            ...prevPermissions,
            [section]: {
                ...prevPermissions[section],
                [permissionType]: !prevPermissions[section][permissionType],
            },
        }));
    };

    const tabs = ['Profile', 'Appraisal'];

    return (
        <div className="form-container urd-container">
            <header className="urd-page-header">User Role Details</header>

            <div className="urd-role-details-section">
                {/* roleId is passed from the list, showing it here */}
                <div className="urd-detail-item"><label className="urd-detail-label">User Role ID</label><input type="text" value={roleId || "R001"} readOnly className="urd-detail-input urd-role-id-input" /></div>
                <div className="urd-detail-item"><label className="urd-detail-label">Role Name</label><input type="text" value="Agreement Mgt" readOnly className="urd-detail-input urd-role-name-input" /></div>
                <div className="urd-detail-item"><label className="urd-detail-label">Status</label><div className="urd-detail-input urd-status-input-wrapper">Active<span className="urd-dropdown-icon">▼</span></div></div>
            </div>

            <h3 className="urd-permissions-heading">Permissions</h3>

            <div className="urd-permissions-tabs-container">
                {tabs.map((tab) => (
                    <button key={tab} className={`urd-permission-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
            </div>

            <div className="urd-permissions-content">
                {activeTab === 'Profile' && (
                    <div className="urd-agreement-permissions">
                        <PermissionRow title="Employee" section="employee" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="Reporting Manager" section="rm" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HR" section="hr" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="HOD" section="hod" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="COO" section="coo" permissions={permissions} onChange={handleCheckboxChange} />
                        <PermissionRow title="CEO" section="ceo" permissions={permissions} onChange={handleCheckboxChange} />
                    </div>
                )}
            </div>

            <div className="urd-action-buttons">
                <button className="urd-save-button">Save</button>
                <button className="urd-back-button" onClick={goToListView}>Back</button>
            </div>
        </div>
    );
};

// --- View Component 2: Add New Role 

const AddNewRoleView = ({ goToListView }) => {
    // State for the new role form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = (action) => {
        console.log(`Saving role with action: ${action}`, { name, description });
        if (action === 'save') {
            goToListView(); // Go back to the list after basic save
        }
        // Other actions would involve state resets or navigation
    };

    return (
        <div className="form-container add-form-container">
            <header className="add-form-header">
                {/* The arrow is the "Back" action */}
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

// --- View Component 3: All Roles / List View (Design 2) ---

const AllRolesView = ({ openDetailsView, openCreateView }) => {
    const [roles] = useState([
        { id: 'R-003', name: 'Employee', status: 'Active', date: '02 Mar 2025' },
        { id: 'R-002', name: 'HR', status: 'Inactive', date: '23 Feb 2022' },
        { id: 'R-001', name: 'CEO', status: 'Active', date: '19-Apr-2025' },
    ]);
    const [roleNameFilter, setRoleNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleSearch = () => {
        console.log("Searching with filters:", { roleNameFilter, statusFilter });
    };

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
                        <tr><th>Role ID</th><th>Role Name</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td><span className={`ar-status-badge ${role.status.toLowerCase()}`}>{role.status}</span></td>
                                <td>
                                    <div className="ar-actions-cell">
                                        <button className="action-button-light action-button--edit-light" onClick={() => openDetailsView(role.id)}>
                                            &#x2022;
                                        </button>
                                        
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ===============================================
// Main Component to Manage State and Render Views
// ===============================================

const Roles = () => {
    // State to control which view is currently visible
    const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'create'
    const [selectedRoleId, setSelectedRoleId] = useState(null); // ID of role being viewed/edited

    // Navigation handlers
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
        switch (currentView) {
            case 'list':
                return <AllRolesView openDetailsView={openDetailsView} openCreateView={openCreateView} />;
            case 'details':
                return <UserRoleDetailsView goToListView={goToListView} roleId={selectedRoleId} />;
            case 'create':
                return <AddNewRoleView goToListView={goToListView} />;
            default:
                return <AllRolesView openDetailsView={openDetailsView} openCreateView={openCreateView} />;
        }
    };

    return (
        <div className="role-manager-app">
            {renderView()}
        </div>
    );
};

export default Roles;