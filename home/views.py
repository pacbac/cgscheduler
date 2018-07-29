from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from utils import date_utils, key_utils, db_utils
import datetime
import json
from .models import TableEdit, EntryEdit

# Create your views here.
def index(request):
    context = {
        'categories': ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks'],
        'entries': ['Place', 'Moderator', 'Children', 'Youth'],
        'dates': date_utils.loadDates(),
        'edits': {}
    }
    dateArr = date_utils.loadDates()
    tableedits = TableEdit.objects.filter(date__gte=date_utils.STARTDATE)
    for edit in tableedits:
        context['edits'][date_utils.dateToStr(edit.date)] = edit.toDict()
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
