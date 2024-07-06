class Employee():
    total_employees = 0

    def get_total_employees(self, database_obj):
        try:
            employees = database_obj.child("Employee").get().val()
            self.total_employees = len(employees) if employees else 0
            return self.total_employees
        
        except Exception as e:
            print(e)
