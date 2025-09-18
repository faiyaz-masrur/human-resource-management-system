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
    FinalReviewerAppraisalTimer,
    EmployeeAppraisalTrack
    
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HRReviewSerializer,
    FinalReviewSerializer,
    EmployeeAppraisalTimerSerializer,
    ReportingManagerAppraisalTimerSerializer,
    FinalReviewerAppraisalTimerSerializer,
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
                {'error': 'The employee self-appraisal period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save(
                    employee=request.user.employee_profile
                    
                )
                 # --- Update EmployeeAppraisalTrack ---
                track, _ = EmployeeAppraisalTrack.objects.get_or_create(
                    employee=request.user.employee_profile
                )
                track.self_appraisal_done = True
                track.save()
                
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
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=manager_profile
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
            rm_review, created = ReportingManagerReview.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = ReportingManagerReviewSerializer(instance=rm_review, data=request.data)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)
                    track.rm_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class HRReviewAPIView(APIView):
    permission_classes = [IsHR]

    def post(self, request, appraisal_id):
        timer = FinalReviewerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The HR review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            hr_review, created = HRReview.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = HRReviewSerializer(instance=hr_review, data=request.data)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)
                    track.hr_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class FinalReviewAPIView(APIView):
    permission_classes = [IsHODCOOCEO]

    def post(self, request, appraisal_id):
        timer = FinalReviewerAppraisalTimer.objects.first()
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
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)

                    reviewer = request.user.employee_profile
                    if reviewer.role == "HOD":
                        track.hod_review_done = True
                    elif reviewer.role == "COO":
                        track.coo_review_done = True
                    elif reviewer.role == "CEO":
                        track.ceo_review_done = True

                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------- Admin Timer Creation API Views -------------------

class EmployeeAppraisalTimerCreationAPIView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        if EmployeeAppraisalTimer.objects.exists():
            return Response(
                {'error': 'An Employee Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportingManagerAppraisalTimerCreationAPIView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        if ReportingManagerAppraisalTimer.objects.exists():
            return Response(
                {'error': 'A Reporting Manager Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReportingManagerAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FinalReviewerAppraisalTimerCreationAPIView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        if FinalReviewerAppraisalTimer.objects.exists():
            return Response(
                {'error': 'A Final Reviewer Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = FinalReviewerAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- Previous Appraisal History API View -------------------

class AppraisalHistoryAPIView(APIView):
    def get(self, request, appraisal_id):
        # Using a single get_object_or_404 to check for appraisal existence
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        
        response_data = {}
        
        # Always include the employee's self-appraisal
        response_data['employee_appraisal'] = EmployeeAppraisalSerializer(appraisal).data
        
        # Try to fetch RM Review, if it exists
        try:
            rm_review = ReportingManagerReview.objects.get(appraisal=appraisal)
            rm_review_data = ReportingManagerReviewSerializer(rm_review).data
        except ReportingManagerReview.DoesNotExist:
            rm_review_data = None
            
        # Try to fetch HR Review, if it exists
        try:
            hr_review = HRReview.objects.get(appraisal=appraisal)
            hr_review_data = HRReviewSerializer(hr_review).data
        except HRReview.DoesNotExist:
            hr_review_data = None
            
        # Try to fetch Final Review, if it exists
        try:
            final_review = FinalReview.objects.get(appraisal=appraisal)
            final_review_data = FinalReviewSerializer(final_review).data
        except FinalReview.DoesNotExist:
            final_review_data = None
            
        # Add data to the response based on the user's role
        # RM can see their own review and the self-appraisal
        if IsRM().has_permission(request, self):
            if rm_review_data:
                response_data['reporting_manager_review'] = rm_review_data

        # HR can see their own review, RM review, and self-appraisal
        if IsHR().has_permission(request, self):
            if rm_review_data:
                response_data['reporting_manager_review'] = rm_review_data
            if hr_review_data:
                response_data['hr_review'] = hr_review_data
        
        # HOD, COO, CEO can see all parts
        if IsHODCOOCEO().has_permission(request, self):
            if rm_review_data:
                response_data['reporting_manager_review'] = rm_review_data
            if hr_review_data:
                response_data['hr_review'] = hr_review_data
            if final_review_data:
                response_data['final_review'] = final_review_data
        
        return Response(response_data, status=status.HTTP_200_OK)
