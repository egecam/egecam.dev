from django.shortcuts import render
from django.http import HttpResponse
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Create your views here.
def index(req):
    client_id = "5b1060dab6f44ac48ec834bf7b8b41f4"
    client_secret = "d15a4f015d384430ab6930b5b50de279"
    appname = "nowplaying"


    # sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri="http://localhost:8000/callback", scope="user-read-currently-playing")

    # access_token = sp_oauth.get_access_token()  
    # refresh_token = sp_oauth.get_refresh_token()  
    
    return render(req, 'index.html')

def callback(req):
    return render(req, 'spotify.html')

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

