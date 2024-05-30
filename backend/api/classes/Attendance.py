from deepface import DeepFace
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import datetime
import pytz
import os

class Attendance():
    # Function to clear existing captures in the temp folder
    def clear_temp_folder(self, main_dir, temp_dir):
        # Remove the existing files in the temp folder
        for file in os.listdir(os.path.join(main_dir, temp_dir)):
            folder_path = os.path.join(main_dir, temp_dir)
            file_path = os.path.join(folder_path, file)
            os.unlink(file_path)

    # Function to save the uploaded file to the temp folder
    def save_uploaded_file(self, request, main_dir, temp_dir):
        file = request.FILES['photo']
        file_path = os.path.join(temp_dir, file.name)
        default_storage.save(file_path, ContentFile(file.read()))
        uploaded_file_path = os.path.join(main_dir, temp_dir, file.name)
        return uploaded_file_path

    # Function to verify the employee
    def verify_employee(self, img1_path, img2_path):
        result = DeepFace.verify(img1_path=img1_path, img2_path=img2_path)
        return result["verified"]
    
    # Function to save attendance to database
    def record_attendance(self, database_obj, emp_no):
        # Get Current Date and Time Values
        current_date = datetime.datetime.now(pytz.timezone('Asia/Colombo'))
        current_year = current_date.year
        current_month = current_date.strftime("%B")
        current_day = current_date.day
        current_time = current_date.strftime("%H:%M:%S")

        # Reference to the specific location in the database and append the attendance  
        att_table = database_obj.child("Attendance").child(str(current_year)).child(current_month).child(emp_no)
        att_table.child(str(current_day)).set(current_time)