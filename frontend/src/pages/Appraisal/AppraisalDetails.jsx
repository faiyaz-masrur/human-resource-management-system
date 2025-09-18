import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import EmployeeAppraisal from './components/AppraisalDetailsComponents/EmployeeAppraisal'
import ReportingManagerAppraisal from './components/AppraisalDetailsComponents/ReportingManagerAppraisal'
import HrAppraisal from './components/AppraisalDetailsComponents/HrAppraisal'
import HodAppraisal from './components/AppraisalDetailsComponents/HodAppraisal'
import CooAppraisal from './components/AppraisalDetailsComponents/CooAppraisal'
import CeoAppraisal from './components/AppraisalDetailsComponents/CeoAppraisal'

function AppraisalDetails() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EmployeeAppraisal />
      <ReportingManagerAppraisal />
      <HrAppraisal />
      <HodAppraisal />
      <CooAppraisal />
      <CeoAppraisal />
     
    </>
  )
}

export default AppraisalDetails
