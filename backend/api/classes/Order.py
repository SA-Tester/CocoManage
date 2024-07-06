import smtplib

class Order():

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


    def send_email(self, database_obj, order_id, name, email, quantity, date, total):

        name = name.split(" ")[0].strip()
        subject = "Order Confirmation"
        message = f"Dear {name},\n\nWe are pleased to confirm that we have successfully received your order. Here are the details of your purchase:\n\nOrderID: O00{order_id}\nOrder Date: {date}\nQuantity: {quantity}\nTotal Amount: Rs. {total}.00\n\nYour order will be processed within 2-3 days. You can pick up your order at our estate.\n\nAddress : MOOROCK ESTATE, Thalgaspitiya, Ambakote, Mawathagama, Sri Lanka.\n\nFor your convenience, you can choose one of the following payment methods:\n1. You can pay for your order when you come to pick it up at estate.\n2. You can deposit the payment into our bank account. Please use the following bank details:\n\nBank Name: People's Bank\nAccount Name: Moorock Estate\nAccount Number: 1234567890\nBranch: Thalgaspitiya\n\nIf you choose to pay by bank deposit, please bring the deposit receipt when you come to pick up your order.\n\nIf you have any questions or need further assistance, please do not hesitate to contact us at moorockestate@gmail.com or call us at 071-2345678.\n\nThank you for your order!\n\n\nBest regards,\nAdmin\nCocomanage"

        text = f"Subject: {subject}\n\n{message}"
        server = smtplib.SMTP("smtp.gmail.com", 587)

        try:
            server.starttls()
            server.login("moorockestate@gmail.com", "zrrdjnpbyrfdmguy")
            server.sendmail("moorockestate@gmail.com", email, text)
            server.quit()
            return 0
        except Exception as e:
            print(e)
            return 1