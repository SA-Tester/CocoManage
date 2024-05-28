from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .db import init_db
from deepface import DeepFace
import os

database = init_db()

# @api_view(['GET'])
# def hello_world(request):
#     test_name = database.child("Attendance").child("2024").child("January").child("EMP0001").get().val()
#     return Response({'message': test_name})

class VerifyEmployeeView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    # Function to verify the employee
    def verify_employee(img1_path, img2_path):
        result = DeepFace.verify(img1_path=img1_path, img2_path=img2_path)
        return result["verified"]


    # Function to post the result for the client side
    def post(self, request, *args, **kwargs):
        # Define the main and temp directories
        main_dir = 'media'
        temp_dir = 'temp'
        registry_dir = 'registry'

        # Remove the existing files in the temp folder
        for file in os.listdir(os.path.join(main_dir, temp_dir)):
            folder_path = os.path.join(main_dir, temp_dir)
            file_path = os.path.join(folder_path, file)
            os.unlink(file_path)
        
        # Save the uploaded file to the temp folder
        file = request.FILES['photo']
        file_path = os.path.join(temp_dir, file.name)
        default_storage.save(file_path, ContentFile(file.read()))
        
        # Store the uploaded file path
        uploaded_file_path = os.path.join(main_dir, temp_dir, file.name)

        # Initialize the employee number
        emp_no = None

        # Loop through the registry folder to verify the image of the employee uploaded
        for file in os.listdir(os.path.join(main_dir, registry_dir)):
            # Store the current file path of the iteration
            current_file_path = os.path.join(main_dir, registry_dir, file)

            # Try catch method to verify the employee
            try:
                if VerifyEmployeeView.verify_employee(current_file_path, uploaded_file_path):
                    emp_no = file.split(".")[0]
                    break
                
            except Exception:
                emp_no = None
        
        # Return the employee number
        if emp_no != None:
            return Response({"emp_no": emp_no}, status=status.HTTP_201_CREATED)
        return Response({"emp_no": emp_no}, status=status.HTTP_401_UNAUTHORIZED)