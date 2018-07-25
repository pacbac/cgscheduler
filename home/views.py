from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    context = {
        'categories': ['Dates', 'Place', 'Topic', 'Moderator', 'Children', 'Youth', 'Remarks'],
        'entries': ['Place', 'Moderator', 'Children', 'Youth']
    }
    return render(request, 'index.html', context)
