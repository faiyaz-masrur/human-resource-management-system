// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 👈 Import Link

// 1. Updated menuItems with 'path' properties
const menuItems = [
  // Define the path for each item. Ensure these paths match your Router setup.
  { name: 'Dashboard', icon: '📊', path: '/' },
  { name: 'My Profile', icon: '👤', path: '/employee-details' },
  { name: 'Attendance', icon: '📋', path: '/attendance' },
  { name: 'Payroll', icon: '💵', path: '/payroll' },
  { name: 'Employees', icon: '👥', path: '/employees' },
  { name: 'Taxes', icon: '🧾', path: '/taxes' },
  { name: 'Provident Fund', icon: '💰', path: '/provident-fund' },
  { name: 'Appraisal', icon: '👍', path: '/appraisal' },
  { name: 'Reports', icon: '📈', path: '/reports' },
  { name: 'Configurations', icon: '⚙️', path: '/configurations' }, 
  { name: 'Settings', icon: '⚙️', path: '/settings' },
];

const Sidebar = ({ className, onClose }) => {
  // Optional: Get the current path to apply 'active' class
  // const location = useLocation(); 

  return (
    <div className={className}>
      <div className="sidebar-header">
        {/* Placeholder for a Logo or Menu Button on mobile */}
        {/* You may want this to link to the Dashboard as well */}
        <Link to="/">
          <img src=".../assets/sonali-logo.jpg" className="logo" alt="Sonali Intellect Logo" />
        </Link>
      </div>
      
      <div className="sidebar-menu">
        <p className="menu-heading">Menu</p>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            // 2. Wrap the menu item content in the Link component
            <li 
              key={index} 
              // Conditionally set 'active' class (assuming you have this in your CSS)
              // className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              className="menu-item"
            >
              <Link to={item.path} className="menu-link-content" onClick={onClose}>
                <span className="item-icon">{item.icon}</span>
                <span className="item-name">{item.name}</span>
                {/* 3. The arrow should be inside the link content for better click area */}
                {item.name !== 'Dashboard' && <span className="item-arrow">▶</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;