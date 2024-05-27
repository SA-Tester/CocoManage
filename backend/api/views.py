from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.files.storage import default_storage
from .db import init_db

database = init_db()

# @api_view(['GET'])
# def hello_world(request):
#     test_name = database.child("Attendance").child("2024").child("January").child("EMP0001").get().val()
#     return Response({'message': test_name})


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES['photo']
        file_name = default_storage.save(file.name, file)
        return Response(status.HTTP_201_CREATED)
