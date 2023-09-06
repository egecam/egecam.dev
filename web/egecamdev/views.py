from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(req):
    return render(req, 'index.html')

def projects(req):
    return render(req, 'projects.html')

def about(req):
    return render(req, 'about.html')

def photography(req):
    return render(req, 'photography.html')

def music(req):
    return render(req, 'music.html')

def cv(req):
    return render(req, 'cv.html')

def blog(req):
    return render(req, 'blog.html')

