from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .db import init_db

database = init_db()

@api_view(['GET'])
def hello_world(request):
    test_name = database.child("Attendance").child("2024").child("January").child("EMP0001").get().val()
    return Response({'message': test_name})