from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.db import transaction

from .models import (
    EmployeeAppraisal, 
    ReportingManagerReview, 
    HRReview, 
    FinalReview
)
from .serializers import (
    EmployeeAppraisalSerializer, 
    ReportingManagerReviewSerializer, 
    HRReviewSerializer, 
    FinalReviewSerializer
)

class EmployeeSelfAppraisalView(LoginRequiredMixin, View):
    """
    Handles the employee's self-appraisal form using a class-based view.
    """
    def get(self, request):
        form = EmployeeAppraisalSerializer()
        context = {'form': form}
        return render(request, 'appraisals/employee_appraisal.html', context)
    
    def post(self, request):
        form = EmployeeAppraisalSerializer(request.POST)
        if form.is_valid():
            appraisal = form.save(commit=False)
            # Link the appraisal to the employee here
            # appraisal.employee = request.user.employee_profile
            appraisal.save()
            return redirect('success_url')
        
        context = {'form': form}
        return render(request, 'appraisals/employee_appraisal.html', context)

class ReportingManagerReviewView(LoginRequiredMixin, View):
    """
    Handles the Reporting Manager's review form using a class-based view.
    """
    def get(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        try:
            manager_review = ReportingManagerReview.objects.get(appraisal=appraisal)
        except ReportingManagerReview.DoesNotExist:
            manager_review = ReportingManagerReview(appraisal=appraisal, reviewer=request.user.employee_profile)
        
        form = ReportingManagerReviewSerializer(instance=manager_review)
        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/manager_review.html', context)
    
    def post(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        try:
            manager_review = ReportingManagerReview.objects.get(appraisal=appraisal)
        except ReportingManagerReview.DoesNotExist:
            manager_review = ReportingManagerReview(appraisal=appraisal, reviewer=request.user.employee_profile)
        
        form = ReportingManagerReviewSerializer(request.POST, instance=manager_review)
        if form.is_valid():
            form.save()
            return redirect('success_url')
        
        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/manager_review.html', context)

class HRReviewView(LoginRequiredMixin, View):
    """
    Handles the HR review form using a class-based view.
    """
    def get(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        try:
            hr_review = HRReview.objects.get(appraisal=appraisal)
        except HRReview.DoesNotExist:
            hr_review = HRReview(appraisal=appraisal, reviewer=request.user.employee_profile)

        form = HRReviewSerializer(instance=hr_review)
        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/hr_review.html', context)

    def post(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        try:
            hr_review = HRReview.objects.get(appraisal=appraisal)
        except HRReview.DoesNotExist:
            hr_review = HRReview(appraisal=appraisal, reviewer=request.user.employee_profile)

        form = HRReviewSerializer(request.POST, instance=hr_review)
        if form.is_valid():
            form.save()
            return redirect('success_url')
        
        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/hr_review.html', context)

class FinalReviewView(LoginRequiredMixin, View):
    """
    Handles the final review form using a class-based view.
    """
    def get(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        form = FinalReviewSerializer()
        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/final_review.html', context)

    def post(self, request, appraisal_id):
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        form = FinalReviewSerializer(request.POST)
        if form.is_valid():
            final_review_instance = form.save(commit=False)
            final_review_instance.appraisal = appraisal
            final_review_instance.reviewer = request.user.employee_profile
            final_review_instance.save()
            return redirect('success_url')

        context = {'form': form, 'appraisal': appraisal}
        return render(request, 'appraisals/final_review.html', context)
