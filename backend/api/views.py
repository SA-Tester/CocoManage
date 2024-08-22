import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.exceptions import ValidationError
from dotenv import load_dotenv
from .db import init_firebase
from .classes.Attendance import Attendance
from .classes.NutHarvest import NutHarvest
from .classes.Weather import Weather
from .classes.SensorData import SensorData
from .classes.CoconutPlants import CoconutPlants
from .classes.Order import Order
from .classes.Payroll import Payroll
from .classes.Employee import Employee
from .classes.User import SystemUser
from .classes.Common import Common

# Initialize the firebase database object
database_obj = init_firebase().database()

# Initialize the firebase authentication object
auth_obj = init_firebase().auth()

# View related to Verifying Employee Attendance
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

        # Get the employee number of the verified employee
        emp_no = self.attendance.verify_employee(uploaded_file_path)

        if emp_no is not None:
            self.attendance.record_attendance(database_obj, emp_no)
            return Response({"emp_no": emp_no}, status=status.HTTP_201_CREATED)
        return Response({"emp_no": emp_no}, status=status.HTTP_401_UNAUTHORIZED)

# View related to Getting Employee Attendance
class GetAttendanceView(APIView): 
    # Initialize the Attendance class
    attendance = Attendance()

    def get(self, request, *args, **kwargs):
        att_dict = self.attendance.get_attendance_per_day(database_obj)
        return Response({"data": att_dict}, status=status.HTTP_200_OK)

# View related to searching Nut Harvest in Admin Dashboard
class SearchPickView(APIView):
    # Initialize the NutHarvest class
    nut_harvest = NutHarvest()

    def post(self, request, *args, **kwargs):
        pick_number = request.data.get("pick_number")
        year = request.data.get("year")

        result = self.nut_harvest.search_pick(database_obj, pick_number, year)
        if(result["Error"] != None):
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(result, status=status.HTTP_200_OK)
    
# View related to adding/ updating Nut Harvest in Admin Dashboard
class AddUpdatePickView(APIView):
    # Initialize the NutHarvest class
    nut_harvest = NutHarvest()

    def post(self, request, *args, **kwargs):
        pick_date = request.data.get("pick_date")
        pick_number = request.data.get("pick_number")
        nut_count = request.data.get("nut_count")

        state = self.nut_harvest.add_update_pick(database_obj, pick_date, pick_number, nut_count)
        if state == 1:
            return Response({"message": "Failed to add nut count"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Nut count added successfully"}, status=status.HTTP_201_CREATED)
    
# View related to deleting a Nut Harvest in Admin Dashboard
class DeletePickView(APIView):
    # Initialize the NutHarvest class
    nut_harvest = NutHarvest()

    def post(self, request, *args, **kwargs):
        pick_number = request.data.get("pick_number")
        year = request.data.get("year")

        result = self.nut_harvest.delete_pick(database_obj, pick_number, year)
        if result == 1:
            return Response({"message": "Failed to delete pick"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Pick deleted successfully"}, status=status.HTTP_201_CREATED)
    
# View related to getting the yearly Nut Harvest in Admin Dashboard
class GetNutCountView(APIView):
    # Initialize the NutHarvest class
    nut_harvest = NutHarvest()

    def get(self, request, *args, **kwargs):
        result = self.nut_harvest.get_nut_count_per_year(database_obj)
        if result["Error"] != None:
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(result, status=status.HTTP_200_OK)
    
# Views related to retrieving API Weather Data in Admin Dashboard
class GetWeatherView(APIView):
    weather = Weather()

    def get(self, request, *args, **kwargs):
        try:
            weather_data = self.weather.get_weather()
            return Response(weather_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving Todays Sensors Data for Admin Dashboard
class GetTodaysSensorsView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            sensor_data = self.sensor_data.get_todays_sensor_data(database_obj)
            return Response(sensor_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving Historical Sensors Data for Admin Dashboard
class GetHistoricalSensorDataView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            rainfall_data = self.sensor_data.get_rainfall_data(database_obj)
            humidity_data = self.sensor_data.get_humidity_data(database_obj)
            soil_moisture_data = self.sensor_data.get_soil_moisture_data(database_obj)
            temperature_data = self.sensor_data.get_temperature_data(database_obj)

            sensor_data = {"Rainfall": rainfall_data, "Humidity": humidity_data, "Soil Moisture": soil_moisture_data, "Temperature": temperature_data}
            return Response(sensor_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving Additional Admin Data for Admin Dashboard (Orders, Employees, Attendance)
class GetAdditionalAdminDataView(APIView):      
    order = Order()
    employee = Employee("", "", "", "", "", "", "", "", "")
    attendance = Attendance()

    def get(self, request, *args, **kwargs):
        self.order.init_order_info(database_obj)
        total_orders = self.order.get_total_orders()
        first_order_date = self.order.get_first_order_date()
        last_order_date = self.order.get_last_order_date()

        total_employees = self.employee.get_total_employees(database_obj)
        today_attendance = self.attendance.get_today_attendance(database_obj)
        today_employees = today_attendance[0]
        last_recorded_attendance = today_attendance[1]

        data = {"total_orders": total_orders, 
                "first_order_date": first_order_date, 
                "last_order_date": last_order_date, 
                "total_employees": total_employees, 
                "today_employees": today_employees,
                "last_recorded_attendance": last_recorded_attendance}
        
        return Response(data, status=status.HTTP_200_OK)       
       
# Views related to retrieving Coconut Plant Count
class GetCoconutPlantCountView(APIView):
    coconut_plants = CoconutPlants()

    def get(self, request, *args, **kwargs):
        result = self.coconut_plants.get_coconut_plant_count(database_obj)
        if result["Error"] != None:
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(result, status=status.HTTP_200_OK)

# Views related to saving an order
class SaveOrderView(APIView):
    order = Order()
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        fromEmail = os.getenv("officialEmail")
        fromEmailPassword = os.getenv("officialEmailPassword")

        firstname = request.data.get("firstname")
        lastname = request.data.get("lastname")
        name = str(firstname)+ " " + str(lastname)
        phone= request.data.get("phone")
        email = request.data.get("email")
        quantity = request.data.get("quantity")
        date = request.data.get("date")
        total = request.data.get("total")
        newMaximumQuantity = request.data.get("newMaximumQuantity")

        order_id = self.order.save_order(database_obj, name, phone, email, quantity, date, total)
        if order_id == 0:
            return Response({"message": "Failed to save order"}, status=status.HTTP_400_BAD_REQUEST)
        result = self.coconut_plants.update_coconut_plant_count(database_obj, newMaximumQuantity)
        
        if result == 1:
            return Response({"message": "Failed to save order"}, status=status.HTTP_400_BAD_REQUEST)
        state = self.order.send_email(email, fromEmail, fromEmailPassword, order_id, name, quantity, date, total)
        
        if state == 1:
            return Response({"message": "Failed to save order"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Order save successfully"}, status=status.HTTP_201_CREATED)

# Views related to updating order status
class UpdateOrderStatusView(APIView):
    order = Order()
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")
        date = request.data.get("date")
        quantity = request.data.get("quantity")
        email = request.data.get("email")
        new_status = request.data.get("status")
        coconut_plants = request.data.get("coconutPlantsCount")
        total = request.data.get("total")
        name = request.data.get("customer_name")
        fromEmail = os.getenv("officialEmail")
        fromEmailPassword = os.getenv("officialEmailPassword")

        if(new_status=="2"):
            result = self.order.update_status(database_obj, order_id, date, new_status)
            if result == 1:
                return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
            new_plants_count = int(coconut_plants) + int(quantity)
            result2 = self.coconut_plants.update_coconut_plant_count(database_obj, new_plants_count)
            if result2 == 1:
                return Response({"message": "Failed to add quantity to stock"}, status=status.HTTP_400_BAD_REQUEST)
            result3 = self.order.send_cancel_order_notification(email, fromEmail, fromEmailPassword, order_id, name, quantity, date, total)
            if result3 == 1:
                return Response({"message": "Failed to send email"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)
        else:
            result = self.order.update_status(database_obj, order_id, date, new_status)
            if result == 1:
                return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
            result2 = self.order.send_completed_order_notification(email, fromEmail, fromEmailPassword, order_id, name, quantity, date, total)
            if result2 == 1:
                return Response({"message": "Failed to send email"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)

# Views related to updating coconut plant count    
class UpdatePlantCountView(APIView):
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        plantCount = request.data.get("plantCount")

        result = self.coconut_plants.update_coconut_plant_count(database_obj, plantCount)
        if result == 1:
            return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)

# Views related to updating unit price of a coconut plant
class UpdateUnitPriceView(APIView):
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        unitPrice = request.data.get("unitPrice")

        result = self.coconut_plants.update_unit_price(database_obj, unitPrice)
        if result == 1:
            return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)

# View related to Get Dashboard Data for Order Management
class GetDashboardDataOrderManagementView(APIView):
    order = Order()

    def get(self, request, *args, **kwargs):
        self.order.init_order_info(database_obj)
        total_orders = self.order.get_total_orders()
        total_customers = self.order.get_total_customers()
        total_revenue = self.order.get_current_month_revenue(database_obj)
        data = {"total_orders": total_orders,
                "total_customers": total_customers,
                "total_revenue": total_revenue}
        
        return Response(data, status=status.HTTP_200_OK)

# View related to Get Order Data
class GetOrderView(APIView): 
    order = Order()

    def get(self, request, *args, **kwargs):
        order_dict = self.order.get_order_data(database_obj)
        return Response({"data": order_dict}, status=status.HTTP_200_OK)
    
# Views related to retrieving salary details of employees
class InitialSalaryDetailsView(APIView):
    def get(self, request, *args, **kwargs):
        employees = Payroll.get_all_employee_details(database_obj)                 
        salary_details_list = []

        for employee_id, employee_details in employees.items():
            payroll = Payroll(employee_id)
            salary_details = payroll.calculate_initial_salary()
            salary_details_list.append(salary_details)

        return Response(salary_details_list, status=status.HTTP_200_OK)

# Views related to calculating salary of an employee
@api_view(['POST'])
def calculate_salary(request):
    try:
        employee_id = request.data.get('employee_id')
        cash_advance = float(request.data.get('cash_advance', 0))
        festival_loan = float(request.data.get('festival_loan', 0))
        payroll = Payroll(employee_id, cash_advance=cash_advance, festival_loan=festival_loan)
        salary_details = payroll.calculate_salary()
        return Response(salary_details, status=status.HTTP_200_OK)
      
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving dashboard data  of salary
@api_view(['GET'])
def get_dashboard_data(request):
    try:
       dashboard_data = Payroll.get_dashboard_data(database_obj)
       return Response(dashboard_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# View related to View All Employees
class GetAllEmployeesView(APIView):
    employee = Employee("", "", "", "", "", "", "", "", "")

    def get(self, request, *args, **kwargs):
        employees = self.employee.get_all_employees(database_obj)
        return Response(employees, status=status.HTTP_200_OK)

# View related to Add Employee
class AddEmployeeView(APIView):   
    def post(self, request, *args, **kwargs):
        #emp_id, name_with_initials, full_name, nic, position, email, phone, gender, photo
        try:
            emp_id = None
            name_with_initials = request.data.get('name_with_initials')
            full_name = request.data.get('name')
            nic = request.data.get('nic')
            position = request.data.get('position')
            email = request.data.get('email')
            phone = request.data.get('phone')
            gender = request.data.get('gender')
            photo = request.FILES['photo']

            common = Common()
            isValidated = common.validate_employee_form_data(name_with_initials, full_name, nic, position, email, phone, gender)

            if (isValidated):
                employee = Employee(emp_id, name_with_initials, full_name, nic, position, email, phone, gender, photo)
                isEmployeeSaved = employee.add_employee(database_obj)

                if isEmployeeSaved:
                    return Response({"message": "Employee added successfully"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Failed to add employee"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("Form Error")
                return Response({"message": "Invalid form data"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View related to Updating an Employee
class UpdateEmployeeView(APIView):   
    def post(self, request, *args, **kwargs):
        #emp_id, name_with_initials, full_name, nic, position, email, phone, gender, photo
        try:
            common = Common()
            isNewPhotoPresent = False

            emp_id = request.data.get('emp_id')
            name_with_initials = request.data.get('name_with_initials')
            full_name = request.data.get('name')
            nic = request.data.get('nic')
            position = request.data.get('position')
            email = request.data.get('email')
            phone = request.data.get('phone')
            gender = request.data.get('gender')
            photo = ""

            if ('photo' in request.FILES and (common.is_url(request.FILES['photo'].name) == False)):
                isNewPhotoPresent = True
                photo = request.FILES['photo']

            isValidated = common.validate_employee_form_data(name_with_initials, full_name, nic, position, email, phone, gender)
            
            if (isValidated):
                employee = Employee(emp_id, name_with_initials, full_name, nic, position, email, phone, gender, photo)
                isEmployeeSaved = employee.update_employee(database_obj, isNewPhotoPresent)

                if isEmployeeSaved:
                    return Response({"message": "Employee updated successfully"}, status=status.HTTP_201_CREATED)
                else:
                    print("Failed to update employee information")
                    return Response({"message": "Failed to update employee information"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("Form Error")
                return Response({"message": "Invalid form data"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print("Exception: ", e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View related to Delete an Employee
class DeleteEmployeeView(APIView):

    def post(self, request, *args, **kwargs):
        try:
            emp_id = request.data.get('emp_id')
            employee = Employee(emp_id, "", "", "", "", "", "", "", "")
            
            isEmployeeDeleted = employee.delete_employee(database_obj)
            if isEmployeeDeleted:
                return Response({"message": "Employee deleted successfully"}, status=status.HTTP_201_CREATED)
            return Response({"message": "Failed to delete employee"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print("Exception in the View: ", e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# View related to sending email (as a cutomer/ visitor)
class SendMessageView(APIView):
    common = Common()

    def post(self, request, *args, **kwargs):
        try:
            load_dotenv()

            toEmail = os.getenv("toEmail")
            fromEmail = os.getenv("officialEmail")
            fromEmailPassword = os.getenv("officialEmailPassword")

            name = request.data.get('name')
            sendersMail = request.data.get('sendersMail')
            message = request.data.get('message')

            common = Common()
            isSent = common.send_email(toEmail, fromEmail, fromEmailPassword, name, sendersMail, message)
            if isSent:  
                return Response({"message": "Message sent successfully"}, status=status.HTTP_201_CREATED)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# Sign up a User
class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        nic = request.data.get('nic')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirmPassword')

        try:
            user = SystemUser()
            user.validate_signup(database_obj, nic, email, password, confirm_password)
            
            if(user.checkEligibility(database_obj, nic)):
                user.signup(database_obj, auth_obj, email, password)
                return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
            
            else:
                return Response({"message": "User not eligible to signup."}, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as error:
            error_message = ' '.join(error.messages) if isinstance(error, ValidationError) else str(error)
            print(error_message)
            return Response({"error": error.message}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Login a User
class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = SystemUser()

        try:
            loggedIn = user.login(database_obj, auth_obj, email, password)
            if loggedIn != None:
                return Response({"message": "User logged in successfully.", 
                                 "id_token": loggedIn["id_token"], 
                                 "refresh_token": loggedIn["refresh_token"],
                                 "access_level": loggedIn["access_level"]},
                                status=status.HTTP_200_OK)

            return Response({"message": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# Logout a User
class SignOutView(APIView):
    def post(self, request, *args, **kwargs):
        id_token = request.data.get('id_token')

        user = SystemUser()

        try:
            isLoggedOut = user.logout(database_obj, auth_obj, id_token)
            if isLoggedOut:
                return Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)
            return Response({"message": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Refresh a User's Token
class RefreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        id_token = request.data.get('id_token')
        refresh_token = request.data.get('refresh_token')

        user = SystemUser()

        try:
            isValidToken = user.isValidToken(auth_obj, id_token, refresh_token)
            if isValidToken != None:
                return Response({"message": "Token refreshed successfully.", "id_token": isValidToken}, status=status.HTTP_200_OK)
            return Response({"message": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# View related to view profile details
'''class UserProfileView(APIView):
    user = SystemUser(database_obj)

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        user = SystemUser(database_obj)
        user_data = user.get_user(user_id)
        if user_data.get("Error") is None:
            return Response(user_data, status=status.HTTP_200_OK)
        return Response({"message": user_data["Error"]}, status=status.HTTP_404_NOT_FOUND)'''

# View related to password change
'''class ChangeUserPasswordView(APIView):
    user = SystemUser(database_obj)

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        user = SystemUser(database_obj)
        result = user.change_password(user_id, old_password, new_password)
        if result.get("Error") is None:
            return Response({"message": result["Message"]}, status=status.HTTP_200_OK)
        return Response({"message": result["Error"]}, status=status.HTTP_400_BAD_REQUEST) ''' 

# Views related to send reminder
class SendReminderView(APIView):
    order = Order()

    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")
        date = request.data.get("date")
        quantity = request.data.get("quantity")
        email = request.data.get("email")
        reminder_date = request.data.get("reminder_date")
        total = request.data.get("total")
        name = request.data.get("customer_name")
        fromEmail = os.getenv("officialEmail")
        fromEmailPassword = os.getenv("officialEmailPassword")

        result = self.order.send_reminder(email, fromEmail, fromEmailPassword, order_id, name, quantity, date, total)
        if result == 1:
            return Response({"message": "Failed to send reminder"}, status=status.HTTP_400_BAD_REQUEST)
        result2 = self.order.set_reminder_date(database_obj, order_id, date, reminder_date)
        if result2 == 1:
            return Response({"message": "Failed to set reminder date"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Reminder send successfully"}, status=status.HTTP_201_CREATED)
