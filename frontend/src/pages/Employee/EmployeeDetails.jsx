import { useState } from 'react'

import EmployeesOfficialDetails from "../../components/EmployeeDetailsComponents/EmployeesOfficialDetails";
import EmployeesPersonalDetails from "../../components/EmployeeDetailsComponents/EmployeesPersonalDetails";
import EmployeesAddress from "../../components/EmployeeDetailsComponents/EmployeesAddress";
import EmployeesExperience from "../../components/EmployeeDetailsComponents/EmployeesExperience";
import EmployeesEducation from "../../components/EmployeeDetailsComponents/EmployeesEducation";
import EmployeesTrainingCertifications from "../../components/EmployeeDetailsComponents/EmployeesTrainingCertifications";
import EmployeesOtherInfo from "../../components/EmployeeDetailsComponents/EmployeesOtherInfo";
import EmployeesAttchments from "../../components/EmployeeDetailsComponents/EmployeesAttchments";

function EmployeeDetails() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EmployeesOfficialDetails />
      <EmployeesPersonalDetails />
      <EmployeesAddress />
      <EmployeesExperience />
      <EmployeesEducation />
      <EmployeesTrainingCertifications />
      <EmployeesOtherInfo />
      <EmployeesAttchments />
    </>
  )
}

export default EmployeeDetails
