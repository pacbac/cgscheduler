from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from utils import date_utils, key_utils, db_utils
import datetime
import json
from .models import TableEdit, EntryEdit

# Create your views here.
def index(request):
    print(date_utils.dateToStr(datetime.date.today()))
    context = {
        'categories': ['Dates', 'Place', 'Topic', 'Moderator', 'Children', 'Youth', 'Remarks'],
        'entries': ['Place', 'Moderator', 'Children', 'Youth']
    }
    return render(request, 'index.html', context)

def updateEdits(request):
    if request.method != 'POST': return HttpResponse("Doesn't work")
    POST = QueryDict.dict(request.POST)
    response = {}
    for key in POST.keys():
        # splitKey is always in the form ('edits', 'defaultdate', 'category')
        splitKeys = tuple(key_utils.splitKey(key))
        if key_utils.checkKeys(splitKeys) and len(splitKeys) == 3:
            editDate = date_utils.strToDate(splitKeys[1])
            edit = TableEdit.objects.filter(date__startswith=editDate)
            if not edit.exists(): # new obj if a new entry
                edit = TableEdit(date=editDate)
                edit.save()
                db_utils.INSTCATGRIES[splitKeys[2]](edit, POST[key])
                print("New entry saved: (%s)" % str(edit))
            else:
                db_utils.CATGRIES[splitKeys[2]](edit, POST[key]) # each entry has varied properties
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
    return HttpResponse(json.dumps(response))

def updateEntries(request):
    pass
