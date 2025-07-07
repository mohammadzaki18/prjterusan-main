# products/urls.py

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
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
    path('admin_dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('admin_login/', views.admin_login_view, name='admin_login'),
    path('payment_accounts/', views.payment_accounts_view, name='payment'),
    path('confirmation_payment/', views.confirmation_payment_view, name='confirmation_payment'),

    path('api/get_current_user/', views.get_current_user, name='get_current_user'),
    # New Authentication URLs
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('api/send_otp/', views.send_otp, name='send_otp'),
    path('api/verify_otp/', views.verify_otp, name='verify_otp'),
    path('api/logout/', views.user_logout, name='logout'), # Add a logout URL
    path('api/cart/add/', views.add_to_cart, name='add_to_cart'),
    path('api/cart/', views.get_cart_items, name='get_cart'),
    path('api/cart/remove/<int:product_id>/', views.remove_cart_item, name='remove_cart_item'),

    path('api/products/add/', views.add_product, name='add_product'),
    path('api/products/', views.get_product_list, name='get_product_list'),
    path('api/categories/add/', views.add_category, name='add_category'),
    path('api/categories/', views.get_category_list, name='get_category_list'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
