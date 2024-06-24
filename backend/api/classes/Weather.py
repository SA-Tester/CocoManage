import openmeteo_requests
import requests_cache
import pandas as pd
import os
from retry_requests import retry
from dotenv import load_dotenv

class Weather():
    dates = []
    weather_codes = []
    temperatures = []

    def setup_open_meteo(self):
        cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        openmeteo = openmeteo_requests.Client(session = retry_session)
        return openmeteo

    def initialize_parameters(self):
        load_dotenv()

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": os.getenv("latitude"),
            "longitude": os.getenv("longitude"),
            "daily": ["weather_code", "temperature_2m_max"],
            "timezone": os.getenv("timezone"),
            "past_days": os.getenv("past_days")
        }

        return (url, params)
    
    def get_response(self):
        openmeteo = self.setup_open_meteo()
        url, params = self.initialize_parameters()
        
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        return response
    
    def get_weather(self):
        response = self.get_response()
        daily = response.Daily()
        daily_weather_code = daily.Variables(0).ValuesAsNumpy()
        daily_temperature = daily.Variables(1).ValuesAsNumpy()

        daily_data = {"date": pd.date_range(
            start = pd.to_datetime(daily.Time(), unit = "s", utc = False),
            end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = False),
            freq = pd.Timedelta(seconds = daily.Interval()),
            inclusive = "left"
        )}
        daily_data["weather_code"] = daily_weather_code
        daily_data["temperature"] = daily_temperature

        daily_dataframe = pd.DataFrame(data = daily_data)

        for index, row in daily_dataframe.iterrows():
            date = str(row["date"].date())
            self.dates.append(date)
            self.weather_codes.append(row["weather_code"])
            self.temperatures.append(round(row["temperature"], 2))
            
        return (self.dates, self.weather_codes, self.temperatures)