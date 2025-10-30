import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./utils/ProtectedRoute";

import DashboardLayout from './pages/Dashboard/DashboardLayout'; 
import UserLogin from './pages/Login/UserLogin';
import ChangePassword from './pages/Login/ChangePassword';
import ForgetPassword from './pages/Login/ForgetPassword';
import ForgetPasswordUpdate from './pages/Login/ForgetPasswordUpdate';

import MyAppraisal from './pages/Appraisal/MyAppraisal';
import ReviewAppraisals from './pages/Appraisal/ReviewAppraisals';
import AppraisalDetailsEmployee from './pages/Appraisal/AppraisalDetailsEmployee';
import AllAppraisals from './pages/Appraisal/AllAppraisals';
import AppraisalStatus from './pages/Appraisal/AppraisalStatus';
import AppraisalSettings from './pages/Appraisal/AppraisalSettings';

import EmployeeDetails from './pages/Employee/EmployeeDetails';
import Employees from './pages/Employee/Employees';

import MainDashboard from "./pages/Dashboard/MainDashboard";

import Departments from "./components/Configurations/Departments";
import Designations from "./components/Configurations/Designations";
import Grades from "./components/Configurations/Grades";
import Workspaces from "./components/Configurations/Workspaces";
import Roles from "./components/Configurations/Roles";

// -------------------------
// Attendance Components
// -------------------------
import MyAttendance from './pages/Attendance/MyAttendance';
import MyAttendanceHistory from './pages/Attendance/MyAttendanceHistory';
import ReconcileRequest from './pages/Attendance/ReconcileRequest';
import GeoFenceMap from './pages/Attendance/GeoFenceMap';
import AllAttendance from './pages/Attendance/AllAttendance';
import EmployeeAttendance from './pages/Attendance/EmployeeAttendance';
import AttendanceReport from './pages/Attendance/AttendanceReport';


function App() {
  const view = {
    isOwnProfileView: false,
    isEmployeeProfileView: false,
    isAddNewEmployeeProfileView: false,
  }

  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password-update" element={<ForgetPasswordUpdate />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<MainDashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Appraisal */}
          <Route path="appraisal/my" element={<MyAppraisal />} />
          <Route path="appraisal/review" element={<ReviewAppraisals />} />
          <Route path="appraisal/employee" element={<AppraisalDetailsEmployee />} />
          <Route path="appraisal/all" element={<AllAppraisals />} />
          <Route path="appraisal/status" element={<AppraisalStatus />} />
          <Route path="appraisal/settings" element={<AppraisalSettings />} />

          {/* Configurations */}
          <Route path="configurations/departments" element={<Departments />} />
          <Route path="configurations/designations" element={<Designations />} />
          <Route path="configurations/grades" element={<Grades />} />
          {/*<Route path="configurations/workspaces" element={<Workspaces />} />*/}
          <Route path="configurations/roles" element={<Roles />} />

          {/* Employee */}
          <Route path="employee-details/my-profile/" element={<EmployeeDetails view={{...view, isOwnProfileView: true}}/>} />
          <Route path="employee-details/add-new-employee/" element={<EmployeeDetails view={{...view, isAddNewEmployeeProfileView: true}}/>} />
          <Route path="employee-details/employee-profile/:employee_id" element={<EmployeeDetails view={{...view, isEmployeeProfileView: true}}/>} />
          <Route path="employees/" element={<Employees />} />

          {/* ---------------------- */}
          {/* Attendance Routes */}
          {/* ---------------------- */}
          <Route path="attendance/home" element={<MyAttendance />} />
          <Route path="attendance/history" element={<MyAttendanceHistory />} />
          <Route path="attendance/reconcile" element={<ReconcileRequest />} />
          <Route path="attendance/map" element={<GeoFenceMap />} />
          <Route path="/attendance/all" element={<AllAttendance />} />
          <Route path="/attendance/employee/:employeeId" element={<EmployeeAttendance />} />
          <Route path="/attendance/report" element={<AttendanceReport />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
