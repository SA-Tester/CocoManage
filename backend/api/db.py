import pyrebase
import os
from dotenv import load_dotenv

def init_db():
    load_dotenv()

    config = {
        "databaseURL": os.getenv("databaseURL"),
        "apiKey": os.getenv("apiKey"),
        "authDomain": os.getenv("authDomain"),
        "projectId": os.getenv("projectId"),
        "storageBucket": os.getenv("storageBucket"),    
        "messagingSenderId": os.getenv("messagingSenderId"),
        "appId": os.getenv("appId"),
        "measurementId": os.getenv("measurementId")
    }

    firebase = pyrebase.initialize_app(config)
    # auth = firebase.auth()
    database = firebase.database()
    return database