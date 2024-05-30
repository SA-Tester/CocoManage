from django.urls import path
from . import views

urlpatterns = [
    # path('hello-world/', views.hello_world, name='hello_world'),
    path('verify/', views.VerifyEmployeeView.as_view(), name='verify_employee'),
    path('get_attendance/', views.GetAttendanceView.as_view(), name='get_attendance'),
]