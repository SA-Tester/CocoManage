from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .db import init_db
from .classes.Attendance import Attendance
import os

# Initialize the firebase database object
database_obj = init_db()

# @api_view(['GET'])
# def hello_world(request):
#     test_name = database.child("Attendance").child("2024").child("January").child("EMP0001").get().val()
#     return Response({'message': test_name})

class VerifyEmployeeView(APIView):
    # Define the main directory, temp directory and registry directory
    main_dir = 'media'
    temp_dir = 'temp'
    registry_dir = 'registry'

    # Define the parser classes
    parser_classes = (MultiPartParser, FormParser)

    # Initialize the Attendance class
    attendance = Attendance()

    def post(self, request, *args, **kwargs):
        # Clear the temp folder
        self.attendance.clear_temp_folder(self.main_dir, self.temp_dir)

        # Save the uploaded file to the temp folder and get the uploaded file path
        uploaded_file_path = self.attendance.save_uploaded_file(request, self.main_dir, self.temp_dir)

        # Initialize the employee number
        emp_no = None

        # Loop through the registry directory and verify whether the uploaded employee is in the registry
        for file in os.listdir(os.path.join(self.main_dir, self.registry_dir)):
            current_file_path = os.path.join(self.main_dir, self.registry_dir, file)

            # Verify the employee from Deepface image recognition and save attendance to database
            try:
                if self.attendance.verify_employee(current_file_path, uploaded_file_path):
                    emp_no = file.split(".")[0]
                    self.attendance.record_attendance(database_obj, emp_no)
                    break

            except Exception:
                emp_no = None

        if emp_no is not None:
            return Response({"emp_no": emp_no}, status=status.HTTP_201_CREATED)
        return Response({"emp_no": emp_no}, status=status.HTTP_401_UNAUTHORIZED)

class GetAttendanceView(APIView): 
    # Initialize the Attendance class
    attendance = Attendance()

    def get(self, request, *args, **kwargs):
        att_dict = self.attendance.get_attendance_per_day(database_obj)
        return Response({"data": att_dict}, status=status.HTTP_200_OK)