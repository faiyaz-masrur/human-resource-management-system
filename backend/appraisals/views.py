from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission

from system.permissions import IsEmployee, IsRM, IsHR, IsHOD, IsCOO, IsCEO

from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HRReview,
    FinalReview,
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    ReviewerAppraisalTimer,
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HRReviewSerializer,
    FinalReviewSerializer,
)

# ------------------- Custom Permissions -------------------
class IsHODCOOCEO(BasePermission):
    """
    Custom permission to allow HOD, COO, or CEO access.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            IsHOD().has_permission(request, view) or
            IsCOO().has_permission(request, view) or
            IsCEO().has_permission(request, view)
        )

# ------------------- API Views -------------------

class EmployeeSelfAppraisalAPIView(APIView):
    permission_classes = [IsEmployee]

    def post(self, request):
        appraisal_timer = EmployeeAppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response(
                {'error': 'The appraisal period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save(
                    employee=request.user.employee_profile,
                    appraisal_period=appraisal_timer
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManagerAppraisalListAPIView(ListAPIView):
    permission_classes = [IsRM]

    def get_queryset(self):
        try:
            timer = ReportingManagerAppraisalTimer.objects.first()
            if not timer or not timer.is_active_period():
                return EmployeeAppraisal.objects.none()

            manager_profile = self.request.user.employee_profile
            # Filter self-appraisals submitted within the manager review period
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=manager_profile,
                appraisal_submitted_date__range=(timer.reporting_manager_review_start, timer.reporting_manager_review_end)
            )
        except AttributeError:
            return EmployeeAppraisal.objects.none()


class ReportingManagerReviewAPIView(APIView):
    permission_classes = [IsRM]

    def post(self, request, appraisal_id):
        timer = ReportingManagerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The reporting manager review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    permission_classes = [IsHR]

    def post(self, request, appraisal_id):
        timer = ReviewerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The HR review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    permission_classes = [IsHODCOOCEO]

    def post(self, request, appraisal_id):
        timer = ReviewerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The final review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            final_review_instance, created = FinalReview.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = FinalReviewSerializer(instance=final_review_instance, data=request.data)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save(
                        appraisal=appraisal,
                        reviewer=request.user.employee_profile,
                        reviewer_role=request.user.role
                    )
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
