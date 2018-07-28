from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('updateedits', views.updateEdits, name="updateedits"),
    path('updateentries', views.updateEntries, name="updateentries")
]
