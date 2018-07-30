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
        # splitKey is always in the form ('edits', 'dateIndex', 'category')
        splitKeys = tuple(key_utils.splitKey(key))
        if key_utils.checkKeys(splitKeys):
            origDate = date_utils.loadDates()[int(splitKeys[1])]
            edit = TableEdit.objects.filter(date__startswith=date_utils.strToDate(origDate))
            if not edit.exists():
                if (not ((splitKeys[2] == 'newDate' and origDate == POST[key]) # ignore entry if date is just default
                    or (splitKeys[2] != 'newDate' and POST[key] == ""))): # ignore entry if category is empty
                    edit = TableEdit(date=date_utils.strToDate(origDate))
                    edit.save()
                    db_utils.INSTCATGRIES[splitKeys[2]](edit, POST[key])
                    print("New entry saved: (%s)" % str(edit))
            else:
                if (splitKeys[2] == 'newDate' and origDate == POST[key]) or (splitKeys[2] != 'newDate' and POST[key] == ""):
                    db_utils.CATGRIES[splitKeys[2]](edit, None)
                else:
                    db_utils.CATGRIES[splitKeys[2]](edit, POST[key]) # each entry has varied properties
                print("Entry modified: (%s)" % str(edit[0]))
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
    return HttpResponse(json.dumps(response))

def updateEntries(request):
    pass
