WORKSPACE_CHOICES = [
    ("MyProfile", "MyProfile"),
    ("MyAppraisal", "MyAppraisal"),
    ("ReviewAppraisal", "ReviewAppraisal"),
    ("AllAppraisal", "AllAppraisal"),
    ("Employee", "Employee"),
    ("Configuration", "Configuration"),
]

SUB_WORKSPACE_CHOICES = [
    ("MyOfficialDetail", "MyOfficialDetail"),   #MyProfile
    ("MyPersonalDetail", "MyPersonalDetail"),   #MyProfile
    ("MyAddress", "MyAddress"),     #MyProfile
    ("MyWorkExperience", "MyWorkExperience"),   #MyProfile
    ("MyEducation", "MyEducation"),     #MyProfile
    ("MyTrainingCertificate", "MyTrainingCertificate"),     #MyProfile
    ("MyAttatchment", "MyAttachment"),  #MyProfile
    ("EmployeeList", "EmployeeList"),   #Employee
    ("EmployeeOfficialDetail", "EmployeeOfficialDetail"),   #Employee
    ("EmployeePersonalDetail", "EmployeePersonalDetail"),   #Employee
    ("EmployeeAddress", "EmployeeAddress"),     #Employee
    ("EmployeeWorkExperience", "EmployeeWorkExperience"),   #Employee
    ("EmployeeEducation", "EmployeeEducation"),     #Employee
    ("EmployeeTrainingCertificate", "EmployeeTrainingCertificate"),     #Employee
    ("EmployeeAttachment", "EmployeeAttachment"),   #Employee
    ("MyEmployeeAppraisal", "MyEmployeeAppraisal"),     #MyAppraisal
    ("MyRmReview", "MyRmReview"),   #MyAppraisal
    ("MyHrReview", "MyHrReview"),   #MyAppraisal
    ("MyHodReview", "MyHodReview"),     #MyAppraisal
    ("MyCooReview", "MyCooReview"),     #MyAppraisal
    ("MyCeoReview", "MyCeoReview"),     #MyAppraisal
    ("ReviewAppraisalList", "ReviewAppraisalList"),     #ReviewAppraisal
    ("EmployeeEmployeeAppraisal", "EmployeeEmployeeAppraisal"),     #ReviewAppraisal
    ("EmployeeRmReview", "EmployeeRmReview"),   #ReviewAppraisal
    ("EmployeeHrReview", "EmployeeHrReview"),   #ReviewAppraisal
    ("EmployeeHodReview", "EmployeeHodReview"),     #ReviewAppraisal
    ("EmployeeCooReview", "EmployeeCooReview"),     #ReviewAppraisal
    ("EmployeeCeoReview", "EmployeeCeoReview"),     #ReviewAppraisal
    ("AppraisalStatus", "AppraisalStatus"),     #AllAppraisal
    ("AllAppraisalList", "AllAppraisalList"),   #AllAppraisal
    ("AllEmployeeAppraisal", "AllEmployeeAppraisal"),       #AllAppraisal
    ("AllRmReview", "AllRmReview"),     #AllAppraisal
    ("AllHrReview", "AllHrReview"),     #AllAppraisal
    ("AllHodReview", "AllHodReview"),   #AllAppraisal
    ("AllCooReview", "AllCooReview"),   #AllAppraisal
    ("AllCeoReview", "AllCeoReview"),   #AllAppraisal
    ("Department", "Department"),   #Configuration
    ("Designation", "Designation"),     #Configuration
    ("Grade", "Grade"),     #Configuration
    ("Role", "Role"),       #Configuration
]