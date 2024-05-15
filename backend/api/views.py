from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import pyrebase

config = {
    "databaseURL": "https://cocomanage-516c5-default-rtdb.firebaseio.com",
    "apiKey": "AIzaSyDh3E_WGJWBxcEsYGWQvHSAyFJMk5uJ7Y0",
    "authDomain": "cocomanage-516c5.firebaseapp.com",
    "projectId": "cocomanage-516c5",
    "storageBucket": "cocomanage-516c5.appspot.com",
    "messagingSenderId": "551064371999",
    "appId": "1:551064371999:web:bc603a775153b3eb35e62a",
    "measurementId": "G-CGZ0VJ6PKM"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
database = firebase.database()

@api_view(['GET'])
def hello_world(request):
    test_name = database.child("Test").child("EMP0001").get().val()
    return Response({'message': test_name})