import re
import smtplib

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
                        print("Email OK")
                        return True
                    else:
                        print("Email Invalid")
                        return False
                else:
                    print("Email Empty. No Issue")
                    return True
            else: 
                print("NIC or Phone Number Error")
                return False
        else:    
            print("Empty Fields")
            return False
    
    # Validate Email
    def validate_email(self, email):
        reg_str = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if re.match(reg_str, email):
            return True
        return False
    
    # Check if a URL
    def is_url(self, url):
        reg_str = r'^(http|https)://'
        
        if re.match(reg_str, url):
            return True
        return False
    
    def send_email(self, toEmail, fromEmail, fromEmailPassword, name, sendersMail,  message):
        subject = "New Message from " + name
        message = f"A new message was received from {name} ({sendersMail}) through the CoCoManage Web System.\n\nThe message reads:\n{message}"

        text = f"Subject: {subject}\n\n{message}"
        server = smtplib.SMTP("smtp.gmail.com", 587)

        try:
            server.starttls()
            server.login(fromEmail, fromEmailPassword)
            server.sendmail(fromEmail, toEmail, text)
            server.quit()
            return True
        
        except Exception as e:
            print(e)
            return False