// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SonaliLogo from "../../assets/sonali-logo.jpg";
import employeeIcon from "..//../assets/icons/Empl.svg";
import dashboardIcon from "..//../assets/icons/Dashboard.svg";
import myProfileIcon from "..//../assets/icons/Profile.svg";
import configrationIcon from "..//../assets/icons/Configration.svg";
import attendanceIcon from "..//../assets/icons/Attendance.svg";
import payrollIcon from "..//../assets/icons/PayRoll.svg";
import taxesIcon from "..//../assets/icons/Taxes.svg";
import providentFundIcon from "..//../assets/icons/Provident Fund.svg";
import recruitmentIcon from "..//../assets/icons/Recruitment.svg";
import appraisalIcon from "..//../assets/icons/Apprisal.svg";
import communicationIcon from "..//../assets/icons/Communication.svg";
import reportsIcon from "..//../assets/icons/Reports.svg";
import settingIcon from "..//../assets/icons/Settings.svg";

// --- Menu Items Definition ---
const menuItems = [
  { name: 'Dashboard', icon: <img src={dashboardIcon} alt="Dashboard" style={{ width: 18, height: 18 }} />, path: '/' }, 
  { name: 'My Profile', icon: <img src={myProfileIcon} alt="Profile" style={{ width: 18, height: 18 }} />, path: '/employee-details/my-profile' },
  
{ 
    name: 'Attendance', 
    icon: <img src={attendanceIcon} alt="Attendance" style={{ width: 18, height: 18 }} />, 
    path: '/attendance/home',
    subMenu: [
      { name: "Today's Attendance", path: '/attendance/home' }, //
      { name: 'Attendance History', path: '/attendance/history' },
      // { name: 'Reconcile Requests', path: '/attendance/reconcile' }, // 
      // { name: 'Geofence Map', path: '/attendance/map' }, // 
    ]
  },

  { name: 'Payroll', icon: <img src={payrollIcon} alt="payroll" style={{ width: 18, height: 18 }} />, path: '/payroll' },
  { name: 'Employees', icon: <img src={employeeIcon} alt="Employees" style={{ width: 18, height: 18 }} />, path: '/employees' },
  { name: 'Taxes', icon: <img src={taxesIcon} alt="Taxes" style={{ width: 18, height: 18 }} />, path: '/taxes' },
  { name: 'Provident Fund', icon: <img src={providentFundIcon} alt="Provident Fund" style={{ width: 18, height: 18 }} />, path: '/provident Fund' },

  { 
    name: 'Appraisal', 
    icon: <img src={appraisalIcon} alt="Appraisal" style={{ width: 18, height: 18 }} />, path: '/appraisal', 
    subMenu: [
      { name: 'My Appraisal', path: '/appraisal/my' },
      { name: 'Review Appraisals', path: '/appraisal/review' },
      { name: 'All Appraisals', path: '/appraisal/all' },
      { name: 'Active Appraisal Status', path: '/appraisal/status' },
      { name: 'Appraisal Settings', path: '/appraisal/settings' },
    ]
  },
  
  { name: 'Reports',  icon: <img src={reportsIcon} alt="reports" style={{ width: 18, height: 18 }} />, path: '/reports' },
  
  // CONFIGURATIONS DROPDOWN STRUCTURE
  { 
    name: 'Configurations', 
    icon: <img src={configrationIcon} alt="Configration" style={{ width: 18, height: 18 }} />, path: '/configration',  // Default link for the parent item
    subMenu: [
      { name: 'Departments', path: '/configurations/departments' },
      { name: 'Designations', path: '/configurations/designations' },
      { name: 'Grades', path: '/configurations/grades' },
      //{ name: 'Workspaces', path: '/configurations/workspaces' },
      { name: 'Roles & Permissions', path: '/configurations/roles' },
    ]
  },
  
  { name: 'Communications',  icon: <img src={communicationIcon} alt="Communication" style={{ width: 18, height: 18 }} />, path: '/communication' },
  { name: 'Recruitment',  icon: <img src={recruitmentIcon} alt="Recruitment" style={{ width: 18, height: 18 }} />, path: '/recruitment' },
  { name: 'Settings',  icon: <img src={settingIcon} alt="Settings" style={{ width: 18, height: 18 }} />, path: '/settings' },
];

const Sidebar = ({ className, onClose }) => {
  const location = useLocation(); 
  
  const [openMenu, setOpenMenu] = useState(null); 

  const handleToggle = (e, name) => {
    e.preventDefault(); 
    setOpenMenu(openMenu === name ? null : name);
  };
  
  const isParentActive = (item) => {
      if (location.pathname === item.path) return true;
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
                {/* MAIN MENU ITEM */}
                <li 
                  className={`menu-item ${hasSubMenu ? 'menu-dropdown-header' : ''} ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                >
                  <Link 
                    to={item.path} 
                    className="menu-link-content"
                    onClick={hasSubMenu ? (e) => handleToggle(e, item.name) : onClose}
                  >
                    <span className="item-icon">{item.icon}</span> 
                    <span className="item-name">{item.name}</span>
                    {hasSubMenu && <span className={`item-arrow-down ${isOpen ? 'rotated' : ''}`}>{'>'}</span>}
                  </Link>
                </li>
                
                {/* SUBMENU ITEMS */}
                <ul className={`submenu-list ${isOpen ? 'open' : ''}`}> 
                  {item.subMenu && item.subMenu.map((subItem, subIndex) => (
                    <li 
                        key={subIndex} 
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
