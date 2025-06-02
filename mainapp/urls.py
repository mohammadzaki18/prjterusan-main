# products/urls.py

from django.urls import path

from . import views

urlpatterns = [
    path('', views.dashboard, name='home'),
    path('checkout/', views.checkout, name='checkout'),
    path('cart/', views.cart, name='cart'), # Tambahkan path ini
    path('profile/', views.profile, name='profile'),
]