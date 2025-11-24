import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAppraisalPDF = async (appraisalData, employeeDetails) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);

    // Add Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('EMPLOYEE APPRAISAL REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Employee Information Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(59, 130, 246);
    pdf.text('EMPLOYEE INFORMATION', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const employeeInfo = [
      `Employee ID: ${employeeDetails.emp_id || 'N/A'}`,
      `Name: ${employeeDetails.emp_name || 'N/A'}`,
      `Department: ${employeeDetails.emp_dept || 'N/A'}`,
      `Designation: ${employeeDetails.emp_des || 'N/A'}`,
      `Grade: ${employeeDetails.emp_grade || 'N/A'}`,
      `Joining Date: ${employeeDetails.emp_join || 'N/A'}`,
      `Appraisal Period: ${employeeDetails.appraisal_start_date || 'Not Set'} to ${employeeDetails.appraisal_end_date || 'Not Set'}`
    ];

    employeeInfo.forEach(info => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(info, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Generate sections for each appraisal part
    const sections = [
      { 
        title: 'EMPLOYEE SELF APPRAISAL', 
        data: appraisalData.employee,
        fields: [
          { label: 'Achievements/Goal Completion', key: 'achievements_goal_completion' },
          { label: 'Training Plan', key: 'training_plan' },
          { label: 'Development Plan', key: 'development_plan' },
          { label: 'Training Description', key: 'training_description' }
        ]
      },
      {
        title: 'REPORTING MANAGER REVIEW',
        data: appraisalData.reportingManager,
        fields: [
          { label: 'Achievements Remarks', key: 'achievements_remarks' },
          { label: 'Training Remarks', key: 'training_remarks' },
          { label: 'Overall Performance Rating', key: 'overall_performance_rating' },
          { label: 'Justification for Rating', key: 'justify_overall_rating' },
          { label: 'Potential Rating', key: 'potential_rating' },
          { label: 'Final Remarks', key: 'decision_remarks' }
        ]
      },
      {
        title: 'HUMAN RESOURCE REVIEW',
        data: appraisalData.hr,
        fields: [
          { label: 'HR Remarks', key: 'remarks_hr' },
          { label: 'Leave Details', key: 'leaveDetails' },
          { label: 'Attendance Details', key: 'attendanceDetails' },
          { label: 'Salary Recommendations', key: 'salaryDetails' },
          { label: 'Final Decision Remarks', key: 'remarks_on_your_decision' }
        ]
      },
      {
        title: 'HEAD OF DEPARTMENT REVIEW',
        data: appraisalData.hod,
        fields: [
          { label: 'HOD Remarks', key: 'remarks' },
          { label: 'Final Decision Remarks', key: 'remarks_on_your_decision' }
        ]
      },
      {
        title: 'CHIEF OPERATING OFFICER REVIEW',
        data: appraisalData.coo,
        fields: [
          { label: 'COO Remarks', key: 'remarks' },
          { label: 'Final Decision Remarks', key: 'remarks_on_your_decision' }
        ]
      },
      {
        title: 'CHIEF EXECUTIVE OFFICER REVIEW',
        data: appraisalData.ceo,
        fields: [
          { label: 'CEO Remarks', key: 'remarks' },
          { label: 'Final Decision Remarks', key: 'remarks_on_your_decision' }
        ]
      }
    ];

    // Add each section to PDF
    for (const section of sections) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Section Title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text(section.title, margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);

      if (section.data) {
        section.fields.forEach(field => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }

          let value = section.data[field.key];
          
          // Handle special cases
          if (field.key === 'leaveDetails' && section.data.casual_leave_taken !== undefined) {
            value = `Casual: ${section.data.casual_leave_taken}, Sick: ${section.data.sick_leave_taken}, Annual: ${section.data.annual_leave_taken}`;
          } else if (field.key === 'attendanceDetails' && section.data.on_time_count !== undefined) {
            value = `On Time: ${section.data.on_time_count}, Delay: ${section.data.delay_count}, Early Exit: ${section.data.early_exit_count}`;
          } else if (field.key === 'salaryDetails' && section.data.current_basic !== undefined) {
            value = `Current Basic: ${section.data.current_basic}`;
          }

          if (value) {
            // Split long text into multiple lines
            const lines = pdf.splitTextToSize(`${field.label}: ${value}`, contentWidth);
            lines.forEach(line => {
              if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.text(line, margin, yPosition);
              yPosition += 5;
            });
            yPosition += 2;
          }
        });
      } else {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setTextColor(100, 100, 100);
        pdf.text('Not submitted yet', margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 8;
      }

      yPosition += 15;
    }

    // Save the PDF
    const fileName = `appraisal_report_${employeeDetails.emp_id || 'unknown'}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};