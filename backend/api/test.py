from db import init_db
import openmeteo_requests
import requests_cache
import pandas as pd
import os
import datetime
from retry_requests import retry
from dotenv import load_dotenv
from deepface import DeepFace
import statistics

database = init_db()

def get_all_employees( database_obj):
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

def get_all_employee_ids(database_obj):
    employees = get_all_employees(database_obj)
    emp_ids = []
    for employee in employees:
        emp_ids.append(employee["emp_id"])
    return emp_ids

print(get_all_employee_ids(database))