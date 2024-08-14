import re

class Common:
    # Validate Employee Form Data
    def validate_employee_form_data(self, name_with_initials, full_name, nic, position, email, phone, gender):
        if (name_with_initials != "" or 
            full_name != "" or 
            nic != "" or 
            position != "" or 
            phone != "" or
            gender != ""):

            if(len(nic) == 12 and len(phone) == 10 and phone.isdigit()):
                if (email != ""):
                    if(self.validate_email(email)):
                        return True
                    else:
                        return False
                else:
                    return True
            else: 
                return False
        else:    
            return False
    
    # Validate Email
    def validate_email(email):
        reg_str = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if re.match(reg_str, email):
            return True
        return False