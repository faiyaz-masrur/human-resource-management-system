import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import MainDashboard from './pages/Dashboard/MainDashboard'
import Employees from './pages/Employee/Employees'
import EmployeeDetails from './pages/Employee/EmployeeDetails'


function HeroSection() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainDashboard />
      <Employees />
      <EmployeeDetails />
      <AppraisalDetails />
    </>
  )
}

export default HeroSection
