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
    path('save_order/', views.SaveOrderView.as_view(), name='save_order'),
    path('update_coconut_plant_count/', views.SaveOrderView.as_view(), name='update_coconut_plant_count'),
    path('update_coconut_plants_count/', views.UpdatePlantCountView.as_view(), name='update_coconut_plant_count'),
    path('update_unit_price/', views.UpdateUnitPriceView.as_view(), name='update_unit_price'),
    path('employee_data/', views.InitialSalaryDetailsView.as_view(), name='employee_data'),
    path('calculate_salary/', views.calculate_salary, name='calculate_salary'), 
    path('payroll_dashboard_data/', views.get_dashboard_data, name='payroll_dashboard_data'),
    path('employee_data/', views.InitialSalaryDetailsView.as_view(), name='employee_data'),
    path('calculate_salary/', views.calculate_salary, name='calculate_salary'), 
    path('payroll_dashboard_data/', views.get_dashboard_data, name='payroll_dashboard_data'),
    path('update_coconut_plants_count/', views.UpdatePlantCountView.as_view(), name='update_coconut_plant_count'),
    path('update_unit_price/', views.UpdateUnitPriceView.as_view(), name='update_unit_price'),
]