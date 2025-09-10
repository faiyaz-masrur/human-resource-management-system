from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db import transaction

from .models import (
    EmployeeAppraisal, 
    ReportingManagerReview, 
    HRReview, 
    FinalReview
)
from .serializers import (
    EmployeeAppraisalForm, 
    ReportingManagerReviewForm, 
    HRReviewForm, 
    FinalReviewForm
)

@login_required
def employee_self_appraisal(request):
    """
    Handles the employee's self-appraisal form.
    """
    # Assuming the employee model has a one-to-one relationship with the user model
    # employee = request.user.employee_profile 

    if request.method == 'POST':
        form = EmployeeAppraisalForm(request.POST)
        if form.is_valid():
            appraisal = form.save(commit=False)
            # You will need to link the appraisal to the employee here
            # appraisal.employee = employee
            appraisal.save()
            return redirect('success_url')  # Redirect to a success page
    else:
        form = EmployeeAppraisalForm()

    context = {'form': form}
    return render(request, 'appraisals/employee_appraisal.html', context)

@login_required
def reporting_manager_review(request, appraisal_id):
    """
    Handles the Reporting Manager's review form.
    """
    # Check for manager permissions here
    # if not request.user.is_manager:
    #     return redirect('access_denied')

    appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)

    # Try to get the existing review or create a new one
    try:
        manager_review = ReportingManagerReview.objects.get(appraisal=appraisal)
    except ReportingManagerReview.DoesNotExist:
        manager_review = ReportingManagerReview(appraisal=appraisal, reviewer=request.user.employee_profile)

    if request.method == 'POST':
        form = ReportingManagerReviewForm(request.POST, instance=manager_review)
        if form.is_valid():
            form.save()
            return redirect('success_url')
    else:
        form = ReportingManagerReviewForm(instance=manager_review)

    context = {'form': form, 'appraisal': appraisal}
    return render(request, 'appraisals/manager_review.html', context)

@login_required
def hr_review(request, appraisal_id):
    """
    Handles the HR review form.
    """
    # Check for HR permissions here
    # if not request.user.is_hr:
    #     return redirect('access_denied')

    appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
    
    try:
        hr_review = HRReview.objects.get(appraisal=appraisal)
    except HRReview.DoesNotExist:
        hr_review = HRReview(appraisal=appraisal, reviewer=request.user.employee_profile)

    if request.method == 'POST':
        form = HRReviewForm(request.POST, instance=hr_review)
        if form.is_valid():
            form.save()
            return redirect('success_url')
    else:
        form = HRReviewForm(instance=hr_review)

    context = {'form': form, 'appraisal': appraisal}
    return render(request, 'appraisals/hr_review.html', context)

@login_required
def final_review(request, appraisal_id):
    """
    Handles the HOD, COO, and CEO review form.
    """
    appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
    
    # Permission checks for HOD, COO, CEO
    # if not (request.user.is_hod or request.user.is_coo or request.user.is_ceo):
    #     return redirect('access_denied')
        
    if request.method == 'POST':
        form = FinalReviewForm(request.POST)
        if form.is_valid():
            final_review_instance = form.save(commit=False)
            final_review_instance.appraisal = appraisal
            final_review_instance.reviewer = request.user.employee_profile
            # Automatically set the reviewer role based on user permissions
            # if request.user.is_hod:
            #     final_review_instance.reviewer_role = 'hod'
            # elif request.user.is_coo:
            #     final_review_instance.reviewer_role = 'coo'
            # elif request.user.is_ceo:
            #     final_review_instance.reviewer_role = 'ceo'
            final_review_instance.save()
            return redirect('success_url')
    else:
        form = FinalReviewForm()

    context = {'form': form, 'appraisal': appraisal}
    return render(request, 'appraisals/final_review.html', context)
