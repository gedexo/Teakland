from django.shortcuts import render

# Create your views here.

def log_in(request):
    return render(request, 'factory/login.html')

def jobcard(request):
    return render(request, 'factory/jobcard.html')

def view_jobcard(request):
    return render(request, 'factory/view-job-card.html')

def delivered_jobcard(request):
    return render(request, 'factory/jobcard-completed.html')

def print_quotation(request):
    return render(request, 'factory/print-quotation.html')

def doors(request):
    return render(request, 'factory/doors.html')

def window(request):
    return render(request, 'factory/window.html')

def kattla(request):
    return render(request, 'factory/kattla.html')

def custom_kattla(request):
    return render(request, 'factory/custom-kattla.html')

def gallery(request):
    return render(request, 'factory/gallery.html')