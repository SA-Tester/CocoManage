from ..db import init_db
import datetime

class Payroll():
    def __init__(self, employee_id, cash_advance=0, festival_loan=0):
        self.employee_id = employee_id
        self.cash_advance = float(cash_advance)
        self.festival_loan = float(festival_loan)
        self.database = init_db()
        self.employee_details = self.get_employee_details()
        self.set_current_year_month()
        self.worked_days = self.get_worked_days()
        self.payroll_data = self.get_existing_payroll_data()
        self.update_worked_days()
        
    def set_current_year_month(self):
        current_date = datetime.datetime.now()
        self.year = current_date.year
        self.month = current_date.strftime("%B")

    #get employee details from Employee table
    def get_employee_details(self):
        employee = self.database.child("Employee").child(self.employee_id).get().val()
        return employee
    
    #get no of worked days from Attendance table
    def get_worked_days(self):
        attendance = self.database.child("Attendance").child(str(self.year)).child(self.month).child(self.employee_id).get().val()
        if attendance:
            worked_days = set()
            for date_time in attendance.keys():
                day = date_time.split(':')[0] 
                worked_days.add(day)
            return len(worked_days)
        return 0
    
    #get existing Payroll table data
    def get_existing_payroll_data(self):
        return self.database.child("Payroll").child(self.year).child(self.month).child(self.employee_id).get().val()
    
    #update payroll data based on worked days
    def update_worked_days(self):
        if self.payroll_data and self.payroll_data["worked_days"] != self.worked_days:
            self.calculate_salary(update=True)
    
    #to fetch initial data
    def calculate_initial_salary(self):
        if self.payroll_data:
            return self.payroll_data

        name = self.employee_details.get("name")
        
        salary_details = {
            "employee_id": self.employee_id,
            "name": name,
            "worked_days": self.worked_days,
        }
        return salary_details

    def calculate_salary(self, update=False):
        name = self.employee_details.get("name")

        basic_pay = 705
        incentive_rate = 95
        
        gender = self.employee_details.get("gender")        
        if gender == "M":
            attendance_allowance = 200
        else:
            attendance_allowance = 100

        basic_salary = self.worked_days * basic_pay
        additional_payment = self.worked_days * incentive_rate
        extra_amount = self.worked_days * attendance_allowance  # attendance allowance based on gender

        # total salary 
        total_salary = basic_salary + additional_payment 

        # Total deductions of salary
        epf = 0.08 * total_salary   # epf 8%
        other_deductions = 28
        total_deductions = epf + self.festival_loan + self.cash_advance + other_deductions

        # net salary
        net_salary = total_salary + extra_amount - total_deductions

        salary_details = {
            "employee_id": self.employee_id,
            "name": name,
            "worked_days": self.worked_days,
            "basic_salary": basic_salary,
            "additional_payment": additional_payment,
            "total_salary": total_salary,
            "extra_amount": extra_amount,
            "epf": epf,
            "cash_advance": self.cash_advance,
            "festival_loan": self.festival_loan,
            "total_deductions": total_deductions,
            "net_salary": net_salary
        }
        self.store_payroll_data(salary_details)
        if update:
            self.payroll_data = salary_details
        return salary_details
    
    def store_payroll_data(self, salary_details):
        salary_details["worked_days"] = self.worked_days
        self.database.child("Payroll").child(self.year).child(self.month).child(self.employee_id).set(salary_details)

    @classmethod
    def get_all_employee_details(cls,database_obj):
        return database_obj.child("Employee").get().val()
    
    @classmethod
    def get_dashboard_data(cls,database_obj):
        current_date = datetime.datetime.now()
        year = str(current_date.year)
        month = current_date.strftime("%B")

        employees = database_obj.child("Employee").get().val()
        total_employees = len(employees) if employees else 0

        payroll_data = database_obj.child("Payroll").child(year).child(month).get().val()
        total_salary_paid = 0

        if payroll_data:
            for employee_id, salary_details in payroll_data.items():
                net_salary = salary_details.get("net_salary", 0)
                if net_salary:
                    total_salary_paid += net_salary


        dashboard_data = {
            "current_month": month,
            "current_year": year,
            "total_employees": total_employees,
            "total_salary_paid": total_salary_paid
        }
        return dashboard_data


