class Order():

    def save_order(self, database_obj, name, phone, email, quantity, date):
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
                "quantity": quantity,
                "date": date
            })

            return 0
        
        except Exception as e:
            print(e)
            return 1