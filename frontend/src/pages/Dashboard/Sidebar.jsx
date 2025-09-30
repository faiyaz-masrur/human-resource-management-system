// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SonaliLogo from "../../assets/sonali-logo.jpg";


// --- Menu Items Definition ---
const menuItems = [
  { name: 'Dashboard', icon: '🏠', path: '/' },
  { name: 'My Profile', icon: '👤', path: '/employee-details/my-profile/' },
  { name: 'Attendance', icon: '📅', path: '/attendance' },
  { name: 'Payroll', icon: '💵', path: '/payroll' },
  { name: 'Employees', icon: '👥', path: '/employees' },
  { name: 'Taxes', icon: '🧾', path: '/taxes' },
  { name: 'Provident Fund', icon: '🏦', path: '/provident-fund' },
  { name: 'Chat', icon: '💬', path: '/chatbot' },
  
  
  { 
    name: 'Appraisal', 
    icon: '⭐', 
    path: '/appraisal', 
    subMenu: [
      { name: 'My Appraisal', path: '/appraisal' },
      { name: 'Other Appraisals', path: '/appraisal/others' },
      { name: 'Appraisal Status', path: '/appraisal/status' },
      { name: 'Appraisal Settings', path: '/appraisal/settings' },
    ]
  },
  
  { name: 'Reports', icon: '📊', path: '/reports' },
  
  // CONFIGURATIONS DROPDOWN STRUCTURE
  { 
    name: 'Configurations', 
    icon: '🛠️', 
    path: '/configurations', // Default link for the parent item
    subMenu: [
      { name: 'Departments', path: '/configurations/departments' },
      { name: 'Designations', path: '/configurations/designations' },
      { name: 'Grades', path: '/configurations/grades' },
      { name: 'Roles', path: '/configurations/roles' },
    ]
  },
  
  { name: 'Job Posting', icon: '💼', path: '/jobpost' },
  { name: 'Settings', icon: '⚙️', path: '/settings' },
];

const Sidebar = ({ className, onClose }) => {
  const location = useLocation(); 
  
  // State to track which menu is open (stores the name of the menu)
  const [openMenu, setOpenMenu] = useState(null); 

  // Function to toggle the dropdown state
  const handleToggle = (e, name) => {
    e.preventDefault(); // Prevent parent link navigation
    setOpenMenu(openMenu === name ? null : name);
  };
  
  // Helper to determine if a parent menu item should be active (either itself or a child is active)
  const isParentActive = (item) => {
      // Check if the parent path is active
      if (location.pathname === item.path) return true;
      // Check if any sub-menu path is active
      if (item.subMenu) {
          return item.subMenu.some(subItem => location.pathname === subItem.path);
      }
      return false;
  }

  return (
    <div className={className}>
      <div className="sidebar-header">
        <Link to="/">
          <img src={SonaliLogo} className="logo-img" alt="Sonali Intellect Logo" />
        </Link>
      </div>
      
      <div className="sidebar-menu">
        <p className="menu-heading">Menu</p>
        <ul className="menu-list">
          {menuItems.map((item, index) => {
            const hasSubMenu = !!item.subMenu;
            const isOpen = openMenu === item.name;
            const isActive = isParentActive(item);

            return (
              <React.Fragment key={index}>
                {/* MAIN MENU ITEM (Parent or Single Link) */}
                <li 
                  // Active class applies if parent or any child is the current route
                  className={`menu-item ${hasSubMenu ? 'menu-dropdown-header' : ''} ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                >
                  <Link 
                    to={item.path} 
                    className="menu-link-content"
                    // If it has a submenu, toggle the state; otherwise, close sidebar (for mobile)
                    onClick={hasSubMenu ? (e) => handleToggle(e, item.name) : onClose}
                  >
                    <span className="item-icon">{item.icon}</span> 
                    <span className="item-name">{item.name}</span>
                    {
                      hasSubMenu 
                        ? <span className={`item-arrow-down ${isOpen ? 'rotated' : ''}`}>▼</span> // Down Arrow for dropdown
                        : item.name !== 'Dashboard' && <span className="item-arrow">▶</span> // Side Arrow for single link
                    }
                  </Link>
                </li>
                
                {/* SUBMENU ITEMS LIST (Visible only if isOpen is true) */}
                <ul className={`submenu-list ${isOpen ? 'open' : ''}`}> 
                  {item.subMenu && item.subMenu.map((subItem, subIndex) => (
                    <li 
                        key={subIndex} 
                        // Active class applies if the sub-item is the current route
                        className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                    >
                      <Link 
                        to={subItem.path} 
                        className="submenu-link-content" 
                        onClick={onClose}
                      >
                        <span className="submenu-name">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;