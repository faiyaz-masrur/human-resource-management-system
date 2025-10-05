import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import ProtectedRoute from "./utils/ProtectedRoute";

import DashboardLayout from './pages/Dashboard/DashboardLayout'; 
import UserLogin from './pages/Login/UserLogin';
import ChangePassword from './pages/Login/ChangePassword';
import ForgetPassword from './pages/Login/ForgetPassword';
import ForgetPasswordUpdate from './pages/Login/ForgetPasswordUpdate';

import AppraisalDetails from './pages/Appraisal/AppraisalDetails';
import OtherAppraisals from './pages/Appraisal/OtherAppraisals';
import AppraisalStatus from './pages/Appraisal/AppraisalStatus';
import AppraisalSettings from './pages/Appraisal/AppraisalSettings';

import EmployeeDetails from './pages/Employee/EmployeeDetails';
import Employees from './pages/Employee/Employees';

import MainDashboard from "./pages/Dashboard/MainDashboard";

import Departments from "./components/Configurations/Departments";
import Designations from "./components/Configurations/Designations";
import Grades from "./components/Configurations/Grades";
import Roles from "./components/Configurations/Roles";

function App() {
  const view = {
    isOwnProfileView: false,
    isEmployeeProfileView: false,
    isAddNewEmployeeProfileView: false,
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes (e.g., Login pages) */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password-update" element={<ForgetPasswordUpdate />} />

         {/* After login, the user will be redirected to "/" which will show the MainDashboard by default */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
         
          <Route index element={<MainDashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          <Route path="appraisal" element={<AppraisalDetails />} />
          <Route path="appraisal/others" element={<OtherAppraisals />} />
          <Route path="appraisal/status" element={<AppraisalStatus />} />
          <Route path="appraisal/settings" element={<AppraisalSettings />} />
          
          <Route path="configurations/departments" element={<Departments />} />
          <Route path="configurations/designations" element={<Designations />} />
          <Route path="configurations/grades" element={<Grades />} />
          <Route path="configurations/roles" element={<Roles />} />

          <Route path="employee-details/my-profile/" element={<EmployeeDetails view={{...view, isOwnProfileView: true}}/>} />
          <Route path="employee-details/add-new-employee/" element={<EmployeeDetails view={{...view, isAddNewEmployeeProfileView: true}}/>} />
          <Route path="employee-details/employee-profile/:employee_id" element={<EmployeeDetails view={{...view, isEmployeeProfileView: true}}/>} />
          <Route path="employees/" element={<Employees />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;