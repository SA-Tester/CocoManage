from django.core.exceptions import ValidationError
from django.utils import timezone
from requests.exceptions import HTTPError
from ..db import init_firebase_admin
from firebase_admin import auth as firebase_admin_auth
import json

class SystemUser:
    PASSWORD_LENGTH = 8
    emp_id = None
    access_level = ""
    created_at = ""

    # Validate user inputs
    def validate_signup(self, database_obj, nic, email, password, confirm_password):
        if not email or not nic or not password or not confirm_password:
            raise ValidationError('All fields are required.')
        
        elif self.check_email(database_obj, email):
            raise ValidationError('The Email already exists. Please use another valid email address.')
        
        elif password != confirm_password:
            raise ValidationError('Passwords do not match.')
        
        elif len(password) < self.PASSWORD_LENGTH:
            raise ValidationError(f"Password should contain at least {self.PASSWORD_LENGTH} characters.") 
        
        else:
            return True


    # To be an User, one should be an Employee and should be a Manager or Assistant Manager
    def checkEligibility(self, database_obj, nic):
        all_employees = database_obj.child('Employee').get().val()
        
        # No employees in the database
        if not all_employees:
            return False
        
        for emp_id, details in all_employees.items():
            if (details.get('nic') == nic and details.get('position') in ["Manager", "Assistant Manager"]):
                self.emp_id = emp_id
                self.access_level = self.get_access_level(details.get('position'))
                self.created_at = timezone.now().isoformat()
                return True
            
        return False


    # Signup a new user
    def signup(self, database_obj, auth_obj, email, password):
        try:
            auth_obj.create_user_with_email_and_password(email, password)
            database_obj.child('User').child(self.emp_id).set({
                "username": email,
                "access_level": self.access_level,
                "created_at": self.created_at
            })

        except Exception as e:
            raise ValidationError(e)


    def login(self, database_obj, auth_obj, email, password):
        try:
            user = auth_obj.sign_in_with_email_and_password(email, password)
            if user != None:
                signed_in_email = user["email"]
                refresh_token = user["refreshToken"]
                local_id = user["localId"]

                data = {
                    "email": signed_in_email,
                    "refresh_token": refresh_token,
                    "local_id": local_id,
                }

                database_obj.child("LoggedIn").push(data, user['idToken'])
                self.get_logged_in_user(database_obj, signed_in_email)
                return {"id_token": user['idToken'], "refresh_token": refresh_token, "access_level": self.access_level}
            return None
        
        except Exception as e:
            raise ValidationError(e)
    

    # Logout a user
    def logout(self, database_obj, auth_obj, id_token):
        try:
            User = database_obj.child('LoggedIn').get().val()
            currentUser = auth_obj.get_account_info(id_token)
            currentUserEmail = currentUser['users'][0]['email']

            for id, details in User.items():
                if details['email'] == currentUserEmail:
                    database_obj.child('LoggedIn').child(id).remove()
                    auth_obj.current_user = None
                    return True

        except Exception as e:
            print(ValidationError(e))
            return False


    # Create accress level
    def get_access_level(self, position):
        if(position == "Manager"):
            return "A1" # Admin Level 1: Managers
        else:
            return "A2" # Admin Level 2: Assistant Managers
        

    # Check whether email already exists
    def check_email(self, database_obj, email):
        all_users = database_obj.child('User').get().val()
        if not all_users:
            return False
        
        for _, details in all_users.items():
            if details.get('username') == email:
                return True
        
        return False
    

    # Get Logged in Employee ID
    def get_logged_in_user(self, database_obj, signed_in_email):
        employee = database_obj.child('User').get().val()
        for emp_id, details in employee.items():
            if details.get('username') == signed_in_email:
                self.emp_id = emp_id
                self.access_level = details.get('access_level')
                return True
        return False
    

    # Check whether the user is logged in and token is valid
    def isValidToken(self, auth_obj, id_token, refresh_token):
        try:
            auth_obj.get_account_info(id_token)
            return id_token
        
        except HTTPError as http_err:
            json_obj = json.loads(http_err.args[1])
            if json_obj["error"]["message"] == "INVALID_ID_TOKEN":
                id_token = self.refresh_token(auth_obj, refresh_token)
                return id_token
            
            print(json_obj)
        
        except Exception as e:
            print(e)
            return None
        

    # Refresh the token
    def refresh_token(self, auth_obj, refresh_token):
        try:
            user = auth_obj.refresh(refresh_token)
            return user['idToken']
        except Exception as e:
            raise ValidationError(e)

    
    #Get logged user's details   
    def get_employee_details(self, database_obj, auth_obj, id_token):
        try:
            Employee = database_obj.child('Employee').get().val()

            currentUser = auth_obj.get_account_info(id_token)
            currentUserEmail = currentUser['users'][0]['email']

            for id, details in Employee.items():
                if details['email'] == currentUserEmail:
                    return details  

            return None  

        except Exception as e:
            raise ValidationError(e)
        
   
    # Change User Password
    def change_password(self, auth_obj, database_object, id_token):
        try:
            user = SystemUser()
            user_details = user.get_employee_details(database_object, auth_obj, id_token)
            
            if user_details != None:
                auth_obj.send_password_reset_email(user_details['email'])
                return True
            
            else:
                return False
        
        except Exception as e:
            raise ValidationError(e)


    # Delete User
    def delete_user(self, database_obj, employee_id):
        try:
            init_firebase_admin()
            database_obj.child("User").child(employee_id).remove()
            username = database_obj.child("User").child(employee_id).child("username").get().val()
            user_record = firebase_admin_auth.get_user_by_email(username)
            user_id = user_record.uid
            firebase_admin_auth.delete_user(user_id)

        except Exception as e:
            print(ValidationError(e))
            return False