from django.shortcuts import render
from django.http import HttpResponse
from utils import parseDate
import datetime

# Create your views here.
def index(request):
    print(parseDate.dateToStr(datetime.date.today()))
    context = {
        'categories': ['Dates', 'Place', 'Topic', 'Moderator', 'Children', 'Youth', 'Remarks'],
        'entries': ['Place', 'Moderator', 'Children', 'Youth']
    }
    return render(request, 'index.html', context)

def update(request):
    if request.method != 'POST': return HttpResponse("Doesn't work")
    print("It works")
    return HttpResponse("It works!")
