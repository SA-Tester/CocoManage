class CoconutPlants():
    def get_coconut_plant_count(self, database_obj):
        try:
            database_table = database_obj.child("CoconutPlants").get()
            quantity = database_table.val().get("Quantity")
            return {"Error": None, "Quantity":quantity}            
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