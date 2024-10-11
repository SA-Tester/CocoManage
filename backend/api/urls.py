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
    path('get_todays_sensors/', views.GetTodaysSensorsView.as_view(), name='get_todays_sensors'),
    path('get_historical_sensors/', views.GetHistoricalSensorDataView.as_view(), name='get_historical_sensors'),
    path('get_other_admin_data/', views.GetAdditionalAdminDataView.as_view(), name='get_other_dashboard_data'),
    path('get_coconut_plant_count/', views.GetCoconutPlantCountView.as_view(), name='get_other_admin_data'),
    path('save_order/', views.SaveOrderView.as_view(), name='save_order'),
    path('send_email/', views.SaveOrderView.as_view(), name='send_email'),
    path('update_coconut_plants_count/', views.UpdatePlantCountView.as_view(), name='update_coconut_plants_count'),
    path('update_unit_price/', views.UpdateUnitPriceView.as_view(), name='update_unit_price'),
    path('get_order_data/', views.GetOrderView.as_view(), name='get_order_data'),
    path('update_order_status/', views.UpdateOrderStatusView.as_view(), name='update_order_status'),
    path('employee_data/', views.InitialSalaryDetailsView.as_view(), name='employee_data'),
    path('calculate_salary/', views.calculate_salary, name='calculate_salary'), 
    path('payroll_dashboard_data/', views.get_dashboard_data, name='payroll_dashboard_data'),
    path('get_dashboard_data/', views.GetDashboardDataOrderManagementView.as_view(), name='get_dashboard_data'),
    path('get_all_employees/', views.GetAllEmployeesView.as_view(), name='get_all_employees'),
    path('add_new_employee/', views.AddEmployeeView.as_view(), name='add_new_employee'),
    path('update_employee/', views.UpdateEmployeeView.as_view(), name='update_employee'),
    path('delete_employee/', views.DeleteEmployeeView.as_view(), name='delete_employee'),
    path('send_message/', views.SendMessageView.as_view(), name='send_message'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('signin/', views.SignInView.as_view(), name='signin'),
    path('signout/', views.SignOutView.as_view(), name='signout'),
    path('refresh_token/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    #path('change_password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('send_reminder/', views.SendReminderView.as_view(), name='send_reminder'),
]