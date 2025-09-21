import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Pages
import HeroSection from './pages/Dashboard/HeroSection';
import Sidebar from './pages/Dashboard/Sidebar';
import Navbar from './pages/Dashboard/Navbar';
import NotificationSidebar from './pages/Dashboard/NotificationSidebar';

import AdminLogin from './pages/Login/AdminLogin';
import UserLogin from './pages/Login/UserLogin';
import ChangePassword from './pages/Login/ChangePassword';
import ForgetPassword from './pages/Login/ForgetPassword';
import ForgetPasswordUpdate from './pages/Login/ForgetPasswordUpdate';

import AppraisalDetails from './pages/Appraisal/AppraisalDetails';
import OtherAppraisals from './pages/Appraisal/OtherAppraisals';
import EmployeeDetails from './pages/Employee/EmployeeDetails';
import Employees from './pages/Employee/Employees';

function App() {
  return (
    <Router>
      {/* Optional: Navbar can be shown on all pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection/>} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password-update" element={<ForgetPasswordUpdate />} />
        <Route path="/appraisal" element={<AppraisalDetails />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>

      
      <Sidebar />
      <NotificationSidebar />
      
    </Router>
  );
}

export default App;
