from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from system.permissions import IsEmployee, IsRM, IsHR, IsHOD, IsCOO, IsCEO

from .models import (
    AppraisalTimer,
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


# --- API Views ---

class EmployeeSelfAppraisalAPIView(APIView):
    """
    API view to handle the creation of a new self-appraisal.
    """
    permission_classes = [IsEmployee]

    def post(self, request):
        """
        Handles POST request to create a new appraisal record.
        """
        appraisal_timer = AppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response({'error': 'The appraisal period is not currently active.'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Link the appraisal to the logged-in employee before saving.
                serializer.save(employee=request.user.employee_profile, appraisal_period=appraisal_timer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManagerAppraisalListAPIView(ListAPIView):
    """
    API view to list all self-appraisals for a specific reporting manager to review.
    The list is filtered to show only appraisals for employees who report to the logged-in user.
    """
    permission_classes = [IsRM]

    def get_queryset(self):
        try:
            appraisal_timer = AppraisalTimer.objects.first()
            if not appraisal_timer or not appraisal_timer.is_active_period():
                return EmployeeAppraisal.objects.none()

            reporting_manager_profile = self.request.user.employee_profile
            # We filter EmployeeAppraisal objects where the related Employee's reporting manager is the current user.
            # We also filter to only show appraisals for the current active period.
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=reporting_manager_profile,
                appraisal_period=appraisal_timer
            )
        except AttributeError:
            # If the logged-in user doesn't have an associated Employee profile, return an empty queryset.
            return EmployeeAppraisal.objects.none()


class ReportingManagerReviewAPIView(APIView):
    """
    API view to handle the Reporting Manager's review.
    """
    permission_classes = [IsRM]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update a manager's review.
        """
        appraisal_timer = AppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response({'error': 'The appraisal period is not currently active.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            manager_review, created = ReportingManagerReview.objects.get_or_create(
                appraisal=appraisal,
                defaults={'reviewer': request.user.employee_profile}
            )
            serializer = ReportingManagerReviewSerializer(instance=manager_review, data=request.data)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HRReviewAPIView(APIView):
    """
    API view to handle the HR review.
    """
    permission_classes = [IsHR]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update an HR review.
        """
        appraisal_timer = AppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response({'error': 'The appraisal period is not currently active.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            hr_review, created = HRReview.objects.get_or_create(
                appraisal=appraisal,
                defaults={'reviewer': request.user.employee_profile}
            )
            serializer = HRReviewSerializer(instance=hr_review, data=request.data)
            
            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FinalReviewAPIView(APIView):
    """
    API view to handle the final review.
    """
    permission_classes = [IsHOD, IsCOO, IsCEO]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update a final review.
        """
        appraisal_timer = AppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response({'error': 'The appraisal period is not currently active.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            # Find an existing final review or create a new one
            final_review_instance, created = FinalReview.objects.get_or_create(
                appraisal=appraisal,
                defaults={'reviewer': request.user.employee_profile}
            )
            serializer = FinalReviewSerializer(instance=final_review_instance, data=request.data)
            
            if serializer.is_valid():
                with transaction.atomic():
                    final_review = serializer.save(
                        appraisal=appraisal, 
                        reviewer=request.user.employee_profile,
                        reviewer_role=request.user.role 
                    )
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
