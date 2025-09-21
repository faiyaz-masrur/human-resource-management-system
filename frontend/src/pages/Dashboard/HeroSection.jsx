import { useState } from 'react'

import MainDashboard from './MainDashboard'
import Employees from '../Employee/Employees'
import EmployeeDetails from '../Employee/EmployeeDetails'
import AppraisalDetails from '../Appraisal/AppraisalDetails'

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
