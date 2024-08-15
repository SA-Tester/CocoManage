import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class Employee():
    emp_id = ""
    name_with_initials = ""
    full_name = ""
    nic = ""
    position = ""
    email = "-"
    phone = ""
    gender = ""
    photo = ""
    total_employees = 0
    registry_dir = 'registry'

    # Employee Class Constructor
    def __init__(self, emp_id, name_with_initials, full_name, nic, position, email, phone, gender, photo):
        self.emp_id = emp_id
        self.name_with_initials = name_with_initials
        self.full_name = full_name
        self.nic = nic
        self.position = position
        self.email = email
        self.phone = phone
        self.gender = gender
        self.photo = photo

    # Get the next Employee ID
    def get_next_emp_id(self, database_obj):
        current_no_of_employees = self.get_total_employees(database_obj)
        existing_emp_ids = self.get_all_employee_ids(database_obj)

        def generate_emp_id(number):
            prefix = ""
            if number < 10:
                prefix = "000"
            elif number < 100:
                prefix = "00"
            elif number < 1000:
                prefix = "0"
            return "EMP" + prefix + str(number)

        next_emp_id_number = current_no_of_employees + 1
        next_emp_id = generate_emp_id(next_emp_id_number)
        
        while next_emp_id in existing_emp_ids:
            next_emp_id_number += 1
            next_emp_id = generate_emp_id(next_emp_id_number)
        
        return next_emp_id
    
    def get_all_employee_ids(self, database_obj):
        employees = self.get_all_employees(database_obj)
        emp_ids = []
        for employee in employees:
            emp_ids.append(employee["emp_id"])

        return emp_ids

    # Get the total number of Employees
    def get_total_employees(self, database_obj):
        try:
            employees = database_obj.child("Employee").get().val()
            self.total_employees = len(employees) if employees else 0
            return self.total_employees
        
        except Exception as e:
            print(e)

    # Get all Employees
    def get_all_employees(self, database_obj):
        try:
            employees = []
            employee_table = database_obj.child("Employee").get()
            
            for employee in employee_table.each():
                employee_data = employee.val()
                employee_data["emp_id"] = employee.key()
                employee_data["photo"] = "http://localhost:8000/media/registry/" + employee_data["photo"]
                employees.append(employee_data)
            
            return employees
        
        except Exception as e:
            print(e)
            return False

    # Add an Employee
    def add_employee(self, database_obj):
        try:
            self.emp_id = self.get_next_emp_id(database_obj)

            isPhotoUploaded = self.save_employee_photo(self.photo, self.emp_id, self.registry_dir)
            
            if(isPhotoUploaded):
                database_obj.child("Employee").child(self.emp_id).set({
                    "emp_id": self.emp_id,
                    "name_with_initials": self.name_with_initials,
                    "name": self.full_name,
                    "nic": self.nic,
                    "position": self.position,
                    "email": self.email,
                    "phone": self.phone,
                    "gender": self.gender,
                    "photo": self.photo
                })
                return True
        
        except Exception as e:
            print(e)
            return False

    # Update an Employee
    def update_employee(self, database_obj, isNewPhotoPresent):
        isPhotoReplaced = False

        if isNewPhotoPresent:
            isPhotoDeleted = self.delete_employee_photo(database_obj, self.emp_id)
            if isPhotoDeleted:
                isPhotoReplaced = self.save_employee_photo(self.photo, self.emp_id, self.registry_dir)

        if((isNewPhotoPresent and isPhotoReplaced)):
            try:
                database_obj.child("Employee").child(self.emp_id).update({
                    "name_with_initials": self.name_with_initials,
                    "name": self.full_name,
                    "nic": self.nic,
                    "position": self.position,
                    "email": self.email,
                    "phone": self.phone,
                    "gender": self.gender,
                    "photo": self.photo
                })

                return True
            
            except Exception as e:
                print(e)
                return False
        
        elif(isNewPhotoPresent != True):
            try:
                database_obj.child("Employee").child(self.emp_id).update({
                    "name_with_initials": self.name_with_initials,
                    "name": self.full_name,
                    "nic": self.nic,
                    "position": self.position,
                    "email": self.email,
                    "phone": self.phone,
                    "gender": self.gender,
                })

                return True
            
            except Exception as e:
                print(e)
                return False

    # Delete an Employee
    def delete_employee(self, database_obj):
        try:
            self.delete_employee_photo(database_obj, self.emp_id)
            database_obj.child("Employee").child(self.emp_id).remove()
            return True
        
        except Exception as e:
            print("Exception is in Employee Class: ", e)
            return False
          
    # Save Employee Photo to Registry
    def save_employee_photo(self, image_file, emp_id, registry_dir):
        file_extension = os.path.splitext(image_file.name)[1]

        if(file_extension.lower() not in ['.jpg', '.jpeg', '.png']):
            return False
        
        else:
            # Construct the new filename based on emp_id and extension
            new_filename = f"{emp_id}{file_extension}"

            # Create the full file path
            file_path = os.path.join(registry_dir, new_filename)

            try:
                # Save the file to the specified path
                default_storage.save(file_path, ContentFile(image_file.read()))
                self.photo = new_filename
                return True
            
            except Exception as e:
                print(e)
                return False
            
    # Delete Employee Photo from Registry
    def delete_employee_photo(self, database_obj, emp_id):
        try:
            employee_table = database_obj.child("Employee").child(emp_id).get().val()
            db_photo = employee_table["photo"]

            file_path = os.path.join(self.registry_dir, db_photo)
            default_storage.delete(file_path)
            return True
        
        except Exception as e:
            print(e)
            return False