from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .db import init_db
from .classes.Attendance import Attendance
from .classes.NutHarvest import NutHarvest
from .classes.Weather import Weather
from .classes.SensorData import SensorData
from .classes.CoconutPlants import CoconutPlants
from .classes.Order import Order
from .classes.Payroll import Payroll
import datetime

# Initialize the firebase database object
database_obj = init_db()

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
    
# Views related to retrieving API Weather Data
class GetWeatherView(APIView):
    weather = Weather()

    def get(self, request, *args, **kwargs):
        try:
            weather_data = self.weather.get_weather()
            return Response(weather_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving Todays Sensors Data
class GetTodaysSensorsView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            sensor_data = self.sensor_data.get_todays_sensor_data(database_obj)
            return Response(sensor_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Views related to retrieving Rainfall Data
class GetRainfallDataView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            rainfall_data = self.sensor_data.get_rainfall_data(database_obj)
            return Response(rainfall_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View related to retrieving Humidity Data
class GetHumidityDataView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            humidity_data = self.sensor_data.get_humidity_data(database_obj)
            return Response(humidity_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View related to retrieving Soil Moisture Data
class GetSoilMoistureDataView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            soil_moisture_data = self.sensor_data.get_soil_moisture_data(database_obj)
            return Response(soil_moisture_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View related to retrieving Temperature Data
class GetTemperatureDataView(APIView):
    sensor_data = SensorData()

    def get(self, request, *args, **kwargs):
        try:
            temperature_data = self.sensor_data.get_temperature_data(database_obj)
            return Response(temperature_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
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
        state = self.order.send_email(database_obj, order_id, name, email, quantity, date, total)
        if state == 1:
            return Response({"message": "Failed to save order"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Order save successfully"}, status=status.HTTP_201_CREATED)
    
# Views related to updating coconut plant count    
class UpdatePlantCountView(APIView):
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        plantCount = request.data.get("plantCount")

        result = self.coconut_plants.update_coconut_plant_count(database_obj, plantCount)
        if result == 1:
            return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)

# Views related to updating unit price    
class UpdateUnitPriceView(APIView):
    coconut_plants = CoconutPlants()

    def post(self, request, *args, **kwargs):
        unitPrice = request.data.get("unitPrice")

        result = self.coconut_plants.update_unit_price(database_obj, unitPrice)
        if result == 1:
            return Response({"message": "Failed to save"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Save successfully"}, status=status.HTTP_201_CREATED)

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
