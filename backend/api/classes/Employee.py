import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class Employee():
    emp_id = ""
    name_with_initials = ""
    full_name = ""
    nic = ""
    position = ""
    email = ""
    phone = ""
    gender = ""
    photo = ""
    total_employees = 0

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

        prefix = ""
        if current_no_of_employees < 10:
            prefix = "000"
        elif current_no_of_employees < 100:
            prefix = "00"
        elif current_no_of_employees < 1000:
            prefix = "0"

        next_emp_id = "EMP" + prefix + str(current_no_of_employees + 1)
        return next_emp_id
    
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
            database_obj.child("Employee").child(self.emp_id).set({
                "emp_id": self.get_next_emp_id(database_obj),
                "name_with_initials": self.name_with_initials,
                "name": self.full_name,
                "nic": self.nic,
                "position": self.position,
                "email": self.email,
                "phone": self.phone,
                "gender": self.gender
            })
            return True
        
        except Exception as e:
            print(e)
            return False

    # Update an Employee
    def update_employee(self, database_obj):
        try:
            database_obj.child("Employee").child(self.emp_id).update({
                "name_with_initials": self.name_with_initials,
                "name": self.full_name,
                "nic": self.nic,
                "position": self.position,
                "email": self.email,
                "phone": self.phone,
                "gender": self.gender
            })
        
        except Exception as e:
            print(e)
            return False

    # Delete an Employee
    def delete_employee(self, database_obj):
        try:
            database_obj.child("Employee").child(self.emp_id).remove()
            return True
        
        except Exception as e:
            print(e)
            return False
        
    
    # Save Employee Photo to Registry
    def save_employee_photo(self, request, main_dir, registry_dir):
        file = request.FILES['photo']
        file_path = os.path.join(registry_dir, file.name)
        
        try:
            default_storage.save(file_path, ContentFile(file.read()))
            return True
        except Exception as e:
            print(e)
            return False
        