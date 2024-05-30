from deepface import DeepFace
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import datetime
import pytz
import os

class Attendance():
    current_year = None
    current_month = None
    current_day = None
    current_time = None

    # Function to initialize current date and time
    def init_date_time(self):
        current_date = datetime.datetime.now(pytz.timezone('Asia/Colombo'))
        self.current_year = current_date.year
        self.current_month = current_date.strftime("%B")
        self.current_day = current_date.day
        self.current_time = current_date.strftime("%H:%M:%S")
    

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
        # Initialize the current date and time
        self.init_date_time()

        # Reference to the specific location in the database and append the attendance  
        att_table = database_obj.child("Attendance").child(str(self.current_year)).child(self.current_month).child(emp_no)
        att_table.child(str(self.current_day)).set(self.current_time)


    # Function to get attendance per day (emp no, name, time, tot_attendance_per month)
    def get_attendance_per_day(self, database_obj):
        # dictionary to store the attendance details
        att_dict = {}

        # Initialize the current date and time
        self.init_date_time()

        att_table = database_obj.child("Attendance").child(self.current_year).child(self.current_month).get()
        i = 0
        for att in att_table.each():
            emp_no = att.key()
            tot_att_per_month = len(att.val())
            today_time = att.val().get(str(self.current_day))

            emp_table = database_obj.child("Employee").child(att.key()).get()
            emp_name = emp_table.val().get("name")

            att_dict[i] = {"emp_no": emp_no, "emp_name": emp_name, "today_time": today_time, "tot_att_per_month": tot_att_per_month}
            i += 1

        return att_dict