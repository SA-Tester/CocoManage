class NutHarvest():
    # Search a Pick
    def search_pick(self, database_obj, pick_number, year):
        try:
            cursor1 = database_obj.child("NutHarvest").child(year).child(str(pick_number))
            actual_date = cursor1.child("Date").get().val()

            cursor2 = database_obj.child("NutHarvest").child(year).child(str(pick_number))
            nut_count = cursor2.child("Nuts").get().val()

            if actual_date == None or nut_count == None:
                return {"Error": "Pick Not Found"}
            return {"Error": None, "Date": actual_date, "Nuts": nut_count}
        
        except Exception:
            return {"Error": "Pick Not Found"}
        

    # Add a Pick
    def add_update_pick(self, database_obj, date, pick_number, nut_count):
        try:
            year = date.split("/")[0].strip()
            # Reference to the specific location in the database and append the nut count  
            harvest_table_date = database_obj.child("NutHarvest").child(year).child(str(pick_number))
            harvest_table_date.child("Date").set(date)

            harvest_table_date = database_obj.child("NutHarvest").child(year).child(str(pick_number))
            harvest_table_date.child("Nuts").set(nut_count)

            return 0
        
        except Exception:
            return 1


    # Delete a Pick
    def delete_pick(self, database_obj, pick_number, year):
        try:
            harvest_table = database_obj.child("NutHarvest").child(str(year)).child(str(pick_number))
            harvest_table.remove()
            return 0
        
        except Exception:
            return 1


    # Get Yearly Nut Counts (For Chart)