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
    ("MyAttachment", "MyAttachment"),  #MyProfile
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


WORKSPACE_SUBWORKSPACE_MAP = [
    ("MyOfficialDetail", "MyProfile"),
    ("MyPersonalDetail", "MyProfile"),  
    ("MyAddress", "MyProfile"),    
    ("MyWorkExperience", "MyProfile"),  
    ("MyEducation", "MyProfile"),     
    ("MyTrainingCertificate", "MyProfile"),     
    ("MyAttachment", "MyProfile"),  
    ("EmployeeList", "Employee"),   
    ("EmployeeOfficialDetail", "Employee"),   
    ("EmployeePersonalDetail", "Employee"),  
    ("EmployeeAddress", "Employee"),     
    ("EmployeeWorkExperience", "Employee"),   
    ("EmployeeEducation", "Employee"),    
    ("EmployeeTrainingCertificate", "Employee"),    
    ("EmployeeAttachment", "Employee"),   
    ("MyEmployeeAppraisal", "MyAppraisal"),     
    ("MyRmReview", "MyAppraisal"),  
    ("MyHrReview", "MyAppraisal"),   
    ("MyHodReview", "MyAppraisal"),    
    ("MyCooReview", "MyAppraisal"),     
    ("MyCeoReview", "MyAppraisal"),    
    ("ReviewAppraisalList", "ReviewAppraisal"),    
    ("EmployeeEmployeeAppraisal", "ReviewAppraisal"),     
    ("EmployeeRmReview", "ReviewAppraisal"),   
    ("EmployeeHrReview", "ReviewAppraisal"),   
    ("EmployeeHodReview", "ReviewAppraisal"),   
    ("EmployeeCooReview", "ReviewAppraisal"),     
    ("EmployeeCeoReview", "ReviewAppraisal"),   
    ("AppraisalStatus", "AllAppraisal"),     
    ("AllAppraisalList", "AllAppraisal"),  
    ("AllEmployeeAppraisal", "AllAppraisal"),       
    ("AllRmReview", "AllAppraisal"),  
    ("AllHrReview", "AllAppraisal"),   
    ("AllHodReview", "AllAppraisal"),
    ("AllCooReview", "AllAppraisal"),   
    ("AllCeoReview", "AllAppraisal"),  
    ("Department", "Configuration"),  
    ("Designation", "Configuration"),     
    ("Grade", "Configuration"),     
    ("Role", "Configuration"),       
]