# products/urls.py

from django.urls import path

from . import views

urlpatterns = [
    path('', views.dashboard, name='home'),
    path('checkout/', views.checkout, name='checkout'),
    path('order_success/', views.order, name='order'),
    path('cart/', views.cart, name='cart'),
    path('profile/', views.profile, name='profile'),
    path('order_history/', views.order_history, name='history'),
    path('privacy_policy/', views.privacy_policy, name='privacy'),
    path('help_faq/', views.help_faq, name='help'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('return_req/', views.return_req, name='return'),
]