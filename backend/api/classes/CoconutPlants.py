class CoconutPlants():
    def get_coconut_plant_count(self, database_obj):
        try:
            database_table = database_obj.child("CoconutPlants").get()
            quantity = database_table.val().get("Quantity")
            unitPrice = database_table.val().get("UnitPrice")
            return {"Error": None, "Quantity":quantity, "UnitPrice":unitPrice}            
        except Exception:
            return {"Error": "Failed to get Plant Counts"}

    def update_coconut_plant_count(self, database_obj, newMaximumQuantity):
        try:
            database_table = database_obj.child("CoconutPlants")
            database_table.child("Quantity").set(int(newMaximumQuantity))
            return 0
        
        except Exception as e:
            print(e)
            return 1

    def update_unit_price(self, database_obj, unitPrice):
        try:
            database_table = database_obj.child("CoconutPlants")
            database_table.child("UnitPrice").set(int(unitPrice))
            return 0
        
        except Exception as e:
            print(e)
            return 1