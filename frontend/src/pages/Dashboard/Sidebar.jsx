import React from 'react';

// Using a simple array to represent the menu items
const menuItems = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'My Profile', icon: '👤' },
  { name: 'Attendance', icon: '📋' },
  { name: 'Payroll', icon: '💵' },
  { name: 'Employees', icon: '👥' },
  { name: 'Taxes', icon: '🧾' },
  { name: 'Provident Fund', icon: '💰' },
  { name: 'Appraisal', icon: '👍' },
  { name: 'Reports', icon: '📈' },
  { name: 'Configurations', icon: '📈' },
  { name: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img src="path/to/logo.png" alt="Sonali Intellect Logo" className="logo" />
      </div>
      <div className="sidebar-menu">
        <p className="menu-heading">Menu</p>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <span className="item-icon">{item.icon}</span>
              <span className="item-name">{item.name}</span>
              {item.name !== 'Dashboard' && <span className="item-arrow">&gt;</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;