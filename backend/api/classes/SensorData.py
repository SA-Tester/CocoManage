import datetime
import statistics

class SensorData():
    todays_date = datetime.datetime.now()
    year = todays_date.strftime("%Y")
    month = todays_date.strftime("%B")
    day = todays_date.strftime("%d")

    today_temperature = 0
    today_rainfall = 0
    today_humidity = 0
    today_soil_moisture = 0

    def get_todays_rainfall(self, database_obj, year, month, day):
        try:
            cursor1 = database_obj.child("SensorData").child("Rainfall").child(year).child(month)
            today_rainfall = cursor1.child(day).get().val()
            return today_rainfall
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"} 
        
    def get_todays_temperature(self, database_obj, year, month, day):
        try:
            cursor1 = database_obj.child("SensorData").child("Temperature").child(year).child(month)
            today_temperature = cursor1.child(day).get().val()
            return today_temperature
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}
        
    def get_todays_humidity(self, database_obj, year, month, day):
        try:
            cursor1 = database_obj.child("SensorData").child("Humidity").child(year).child(month)
            today_humidity = cursor1.child(day).get().val()
            return today_humidity
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}
        
    def get_todays_soil_moisture(self, database_obj, year, month, day):
        try:
            cursor1 = database_obj.child("SensorData").child("SoilMoisture").child(year).child(month)
            today_soil_moisture = cursor1.child(day).get().val()
            return today_soil_moisture
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}
        

    def get_todays_sensor_data(self, database_obj):
        rainfall = self.get_todays_rainfall(database_obj, self.year, self.month, self.day)
        temperature = self.get_todays_temperature(database_obj, self.year, self.month, self.day)
        humidity = self.get_todays_humidity(database_obj, self.year, self.month, self.day)
        soil_moisture = self.get_todays_soil_moisture(database_obj, self.year, self.month, self.day)

        return {"Rainfall": rainfall, "Temperature": temperature, "Humidity": humidity, "Soil Moisture": soil_moisture}
        
    
    def get_rainfall_data(self, database_obj):
        months = []
        rainfall = []

        try:
            cursor1 = database_obj.child("SensorData").child("Rainfall").get()
            for year in cursor1.each():
                for month in year.val().items():
                    temp_item = year.key() + "-" + month[0]
                    months.append(temp_item)
                    rainfall.append(statistics.mean(month[1].values()))

            months.reverse()
            rainfall.reverse()
            return (months, rainfall)
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}

    
    def get_humidity_data(self, database_obj):
        months = []
        humidity = []

        try:
            cursor1 = database_obj.child("SensorData").child("Humidity").get()
            for year in cursor1.each():
                for month in year.val().items():
                    temp_item = year.key() + "-" + month[0]
                    months.append(temp_item)
                    humidity.append(statistics.mean(month[1].values()))

            months.reverse()
            humidity.reverse()
            return (months, humidity)
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}
    
    def get_soil_moisture_data(self, database_obj):
        months = []
        soil_moisture = []

        try:
            cursor1 = database_obj.child("SensorData").child("SoilMoisture").get()
            for year in cursor1.each():
                for month in year.val().items():
                    temp_item = year.key() + "-" + month[0]
                    months.append(temp_item)
                    soil_moisture.append(statistics.mean(month[1].values()))

            months.reverse()
            soil_moisture.reverse()
            return (months, soil_moisture)
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}
    
    def get_temperature_data(self, database_obj):
        months = []
        temperature = []

        try:
            cursor1 = database_obj.child("SensorData").child("Temperature").get()
            for year in cursor1.each():
                for month in year.val().items():
                    temp_item = year.key() + "-" + month[0]
                    months.append(temp_item)
                    temperature.append(statistics.mean(month[1].values()))

            months.reverse()
            temperature.reverse()
            return (months, temperature)
        
        except Exception as e:
            print(e)
            return {"Error": "Data Not Found"}