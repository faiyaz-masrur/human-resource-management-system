import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import DashboardLayout from './pages/Dashboard/DashboardLayout'; 
import UserLogin from './pages/Login/UserLogin';
import ChangePassword from './pages/Login/ChangePassword';
import ForgetPassword from './pages/Login/ForgetPassword';
import ForgetPasswordUpdate from './pages/Login/ForgetPasswordUpdate';

import AppraisalDetails from './pages/Appraisal/AppraisalDetails';
import OtherAppraisals from './pages/Appraisal/OtherAppraisals';
import EmployeeDetails from './pages/Employee/EmployeeDetails';
import Employees from './pages/Employee/Employees';
import MainDashboard from "./pages/Dashboard/MainDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (e.g., Login pages) */}
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password-update" element={<ForgetPasswordUpdate />} />

        {/* This is the nested dashboard layout route */}
        <Route path="/" element={<DashboardLayout />}>
          {/* After login, the user will be redirected to "/" which will show the MainDashboard by default */}
          <Route index element={<MainDashboard />} />
          <Route path="appraisal" element={<AppraisalDetails />} />
          <Route path="other-appraisals" element={<OtherAppraisals />} />
          <Route path="employee-details" element={<EmployeeDetails />} />
          <Route path="employees" element={<Employees />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;