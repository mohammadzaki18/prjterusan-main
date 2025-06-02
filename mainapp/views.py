# products/views.py

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import redirect, render


def dashboard(request):
    return render(request, 'dashboard.html')
def cart(request):
    return render(request, 'cart.html')
def checkout(request):
    return render(request, 'checkout.html')
def profile(request):
    return render(request, 'profile.html')
def order(request):
    return render(request, 'order_success.html')
def order_history(request):
    return render(request, 'order_history.html')