from django.urls import path
from . import views

urlpatterns = [
    path('verify/', views.VerifyEmployeeView.as_view(), name='verify_employee'),
    path('get_attendance/', views.GetAttendanceView.as_view(), name='get_attendance'),
    path('add_update_pick/', views.AddUpdatePickView.as_view(), name='add_update_pick'),
    path('search_pick/', views.SearchPickView.as_view(), name='search_pick'),
    path('delete_pick/', views.DeletePickView.as_view(), name='delete_pick'),
    path('get_nut_count/', views.GetNutCountView.as_view(), name='get_nut_count'),
    path('get_weather/', views.GetWeatherView.as_view(), name='get_weather'),
    path('get_coconut_plant_count/', views.GetCoconutPlantCountView.as_view(), name='get_coconut_plant_count'),
    path('update_profile/', views.UpdateUserProfileView.as_view(), name='update_user_profile'),
    path('change_password/', views.ChangeUserPasswordView.as_view(), name='change_user_password'),
]