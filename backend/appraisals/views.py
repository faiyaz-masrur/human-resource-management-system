from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

# Import the custom permissions from the users app
from .permissions import IsReportingManager, IsHR, IsFinalReviewer

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
# Assuming your Employee model is here
from employees.models import Employee 


# --- API Views ---

class EmployeeSelfAppraisalAPIView(APIView):
    """
    API view to handle the creation of a new self-appraisal.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles POST request to create a new appraisal record.
        """
        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Link the appraisal to the logged-in employee before saving.
                appraisal = serializer.save(employee=request.user.employee_profile)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReportingManagerReviewAPIView(APIView):
    """
    API view to handle the Reporting Manager's review.
    """
    permission_classes = [IsAuthenticated, IsReportingManager]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update a manager's review.
        """
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
    permission_classes = [IsAuthenticated, IsHR]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update an HR review.
        """
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
    permission_classes = [IsAuthenticated, IsFinalReviewer]

    def post(self, request, appraisal_id):
        """
        Handles POST request to create or update a final review.
        """
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
                        # You may need to set the reviewer_role based on the authenticated user.
                        # For example: reviewer_role=request.user.role 
                    )
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
