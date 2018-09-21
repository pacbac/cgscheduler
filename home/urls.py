from django.urls import path
from . import views

urlpatterns = [
    path('api/get', views.getData, name="getData"),
    path('api/updateedits', views.updateEdits, name="updateedits"),
    path('api/updateentries', views.updateEntries, name="updateentries"),
    path('', views.loadPage, name="loadPage"),
    path('edit/', views.loadPage, name="loadPage")
]
