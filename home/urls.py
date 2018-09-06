from django.urls import path
from . import views

urlpatterns = [
    path('get', views.getData, name="getData"),
    path('updateedits', views.updateEdits, name="updateedits"),
    path('updateentries', views.updateEntries, name="updateentries")
]
