from django.contrib import admin
from django.urls import path
from egecamdev import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('projects/', views.projects, name='projects'),
    path('about/', views.about, name='about'),
    path('photography/', views.photography, name='photography'),
    path('music/', views.music, name='music'),
    path('cv/', views.cv, name='cv'),
    path('blog/', views.blog, name='blog'),
]
