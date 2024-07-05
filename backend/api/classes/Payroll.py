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
        

    def set_current_year_month(self):
        current_date = datetime.datetime.now()
        self.year = current_date.year
        self.month = current_date.strftime("%B")

    def get_employee_details(self):
        employee = self.database.child("Employee").child(self.employee_id).get().val()
        return employee
    
    def get_worked_days(self):
        attendance = self.database.child("Attendance").child(str(self.year)).child(self.month).child(self.employee_id).get().val()
        if attendance:
            worked_days = set()
            for date_time in attendance.keys():
                day = date_time.split(':')[0] 
                worked_days.add(day)
            return len(worked_days)
        return 0
    
    def get_existing_payroll_data(self):
        return self.database.child("Payroll").child(self.year).child(self.month).child(self.employee_id).get().val()
    
    def calculate_initial_salary(self):
        if self.payroll_data:
            return self.payroll_data

        basic_pay = 705
        incentive_rate = 95
        
        gender = self.employee_details.get("gender")
        name = self.employee_details.get("name")
        
        if gender == "M":
            attendance_allowance = 200
        else:
            attendance_allowance = 100

        basic_salary = self.worked_days * basic_pay
        additional_payment = self.worked_days * incentive_rate
        extra_amount = self.worked_days * attendance_allowance  # attendance allowance based on gender

        # total salary 
        total_salary = basic_salary + additional_payment 

        # epf 8%
        epf = 0.08 * total_salary
        
        salary_details = {
            "employee_id": self.employee_id,
            "name": name,
            "worked_days": self.worked_days,
            "basic_salary": basic_salary,
            "additional_payment": additional_payment,
            "total_salary": total_salary,
            "extra_amount": extra_amount,
            "epf": epf,
            "festival_loan": 0,
            "cash_advance": 0,
            "total_deductions": 0,
            "net_salary": 0
        }
        return salary_details

    def calculate_salary(self):
        initial_salary_details = self.calculate_initial_salary()
        total_salary = initial_salary_details["total_salary"]

        # Total deductions of salary
        epf = initial_salary_details["epf"]
        other_deductions = 28
        total_deductions = epf + self.festival_loan + self.cash_advance + other_deductions

        # net salary
        net_salary = total_salary + initial_salary_details["extra_amount"] - total_deductions

        salary_details = {
            **initial_salary_details,
            "cash_advance": self.cash_advance,
            "festival_loan": self.festival_loan,
            "total_deductions": total_deductions,
            "net_salary": net_salary
        }

        self.store_payroll_data(salary_details)
        return salary_details
    
    def store_payroll_data(self, salary_details):
        self.database.child("Payroll").child(self.year).child(self.month).child(self.employee_id).set(salary_details)
