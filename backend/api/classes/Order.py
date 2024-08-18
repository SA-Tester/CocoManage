import smtplib
import datetime
import pytz

class Order():
    total_orders = 0
    first_order_date = ""
    last_order_date = ""
    total_customers = 0

    def save_order(self, database_obj, name, phone, email, quantity, date, total):
        try:
            current_year = date.split("/")[2].strip()
            current_month = date.split("/")[1].strip()
             
            orders_ref = database_obj.child("Order")
            
            existing_orders = orders_ref.get()

            # Determine the next order ID
            if existing_orders.each():
                order_years = [int(order.key()) for order in existing_orders.each()]
                latest_year = max(order_years)
            else:
                latest_year = current_year

            orders_ref2 = database_obj.child("Order").child(str(latest_year))
            existing_orders2 = orders_ref2.get()

            if existing_orders2.each():
                order_month = [order.key() for order in existing_orders2.each()]
                latest_month = max(order_month)
            else:
                latest_month = current_month

            orders_ref3 = database_obj.child("Order").child(str(latest_year)).child(str(latest_month))
            existing_orders3 = orders_ref3.get()

            if existing_orders3.each():
                order_ids = [int(order.key()) for order in existing_orders3.each()]
                next_order_id = max(order_ids) + 1
            else:
                next_order_id = 1

            order_table = database_obj.child("Order").child(current_year).child(current_month).child(next_order_id)

            order_table.set({
                "name": name,
                "phone": phone,
                "email": email,
                "quantity": int(quantity),
                "date": date,
                "total": int(total),
                "status": 0,
            })

            return next_order_id
        
        except Exception as e:
            print(e)
            return 0


    def send_email(self, toEmail, fromEmail, fromEmailPassword, order_id, name, quantity, date, total):

        name = name.split(" ")[0].strip()
        subject = "Order Confirmation"
        message = f"Dear {name},\n\nWe are pleased to confirm that we have successfully received your order. Here are the details of your purchase:\n\nOrderID: 00000{order_id}\nOrder Date: {date}\nQuantity: {quantity}\nTotal Amount: Rs. {total}.00\n\nYour order will be processed within 2-3 days. You can pick up your order at our estate.\n\nAddress : MOOROCK ESTATE, Thalgaspitiya, Ambakote, Mawathagama, Sri Lanka.\n\nFor your convenience, you can choose one of the following payment methods:\n1. You can pay for your order when you come to pick it up at estate.\n2. You can deposit the payment into our bank account. Please use the following bank details:\n\nBank Name: People's Bank\nAccount Name: Moorock Estate\nAccount Number: 1234567890\nBranch: Thalgaspitiya\n\nIf you choose to pay by bank deposit, please bring the deposit receipt when you come to pick up your order.\n\nIf you have any questions or need further assistance, please do not hesitate to contact us at moorockestate@gmail.com or call us at 071-2345678.\n\nThank you for your order!\n\n\nBest regards,\nAdmin\nCocomanage"

        text = f"Subject: {subject}\n\n{message}"
        server = smtplib.SMTP("smtp.gmail.com", 587)

        try:
            server.starttls()
            server.login(fromEmail, fromEmailPassword)
            server.sendmail(fromEmail, toEmail, text)
            server.quit()
            return 0
        except Exception as e:
            print(e)
            return 1
        

    def init_order_info(self, database_obj):
        dates = []
        emails = []
        total_orders = 0 

        try:
            order_table = database_obj.child("Order").get()
            
            if order_table.each():
                for year in order_table.each():
                    months = database_obj.child("Order").child(year.key()).get()
                    
                    for month in months.each():
                        orders = database_obj.child("Order").child(year.key()).child(month.key()).get()
                        
                        for order in orders.each():
                            order_data = order.val()
                            if order_data and isinstance(order_data, dict):
                                total_orders += 1
                                dates.append(order_data.get("date", ""))
                                email = order_data.get("email", "")
                                if email and email not in emails:
                                    emails.append(email)

                self.total_orders = total_orders
                self.first_order_date = max(dates) if dates else ""
                self.last_order_date = min(dates) if dates else ""
                self.total_customers = len(emails)

        except Exception as e:
            print(e)


    def get_total_orders(self):
        return self.total_orders

    def get_first_order_date(self):
        return self.first_order_date

    def get_last_order_date(self):
        return self.last_order_date

    def get_total_customers(self):
        return self.total_customers

    def get_current_month_revenue(self, database_obj):
        current_date = datetime.datetime.now(pytz.timezone('Asia/Colombo'))
        self.current_year = current_date.year
        self.current_month = current_date.strftime("%m")
        total_revenue = 0

        try:
            order_table = database_obj.child("Order").child(str(self.current_year)).child(str(int(self.current_month))).get()
            order_data = order_table.val()
            
            if isinstance(order_data, dict):
                for order_id, item in order_data.items():
                    if isinstance(item, dict) and item.get("status") == 1:
                        total_revenue += item.get("total", 0)

            elif isinstance(order_data, list):
                for item in order_data:
                    if isinstance(item, dict) and item.get("status") == 1:
                        total_revenue += item.get("total", 0)
                        
            return total_revenue
        except Exception as e:
            print(e)
            return 0


    def get_order_data(self, database_obj):
        i = 1
        id = 1
        order_dict = {}
        order_table = database_obj.child("Order").get()
            
        for year in order_table.each():
            month = database_obj.child("Order").child(year.key()).get()
            
            for order in month.each():
                order_data = order.val()
                if isinstance(order_data, dict):
                    for order_id, item in order_data.items():
                        if isinstance(item, dict):  # Ensure item is a dict
                            date = item.get("date", "")
                            email = item.get("email", "")
                            name = item.get("name", "")
                            phone = item.get("phone", "")
                            quantity = item.get("quantity", 0)
                            status = item.get("status", 0)
                            total = item.get("total", 0)
                            order_dict[i] = {
                                "order_id": id, 
                                "date": date, 
                                "email": email, 
                                "name": name, 
                                "phone": phone, 
                                "quantity": quantity, 
                                "status": status, 
                                "total": total
                            }
                            i += 1
                            id += 1
                elif isinstance(order_data, list):
                    for item in order_data:
                        if isinstance(item, dict):  # Ensure item is a dict
                            date = item.get("date", "")
                            email = item.get("email", "")
                            name = item.get("name", "")
                            phone = item.get("phone", "")
                            quantity = item.get("quantity", 0)
                            status = item.get("status", 0)
                            total = item.get("total", 0)
                            order_dict[i] = {
                                "order_id": id, 
                                "date": date, 
                                "email": email, 
                                "name": name, 
                                "phone": phone, 
                                "quantity": quantity, 
                                "status": status, 
                                "total": total
                            }
                            i += 1
                            id += 1
                    
        return order_dict

    def update_status(self, database_obj, order_id, date, new_status):
        try:
            current_year = date.split("/")[2].strip()
            current_month = date.split("/")[1].strip()

            order_table = database_obj.child("Order").child(current_year).child(current_month).child(order_id)

            order_table.child("status").set(int(new_status))
            
            return 0
            
        except Exception as e:
            print(e)
            return 1   