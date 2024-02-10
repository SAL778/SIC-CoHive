from django.shortcuts import render


# Create your views here.


from django.shortcuts import render,HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the User index.")
# Create your views here.

