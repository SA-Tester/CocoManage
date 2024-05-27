from django.urls import path
from . import views

urlpatterns = [
    # path('hello-world/', views.hello_world, name='hello_world'),
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
]