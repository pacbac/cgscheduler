from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from utils import date_utils, key_utils, db_utils
import datetime
import json
from .models import TableEdit, EntryEdit

# Create your views here.
def index(request):
    beginYear = datetime.date(datetime.date.today().year, 1, 1)
    context = {
        'categories': ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks'],
        'entries': {'place': [], 'moderator': [], 'children': [], 'youth': []},
        'dates': date_utils.loadDates(beginYear),
        'edits': {},
    }
    tableedits = TableEdit.objects.filter(date__gte=beginYear)
    for edit in tableedits:
        context['edits'][date_utils.dateToStr(edit.date)] = edit.toDict()

    for ctgry in context['entries']:
        for entry in EntryEdit.objects.filter(category=ctgry):
            context['entries'][ctgry].append(entry.name)
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
                    print("New table entry saved: (%s)" % str(edit))
            else:
                if (splitKeys[2] == 'newDate' and origDate == POST[key]) or (splitKeys[2] != 'newDate' and POST[key] == ""):
                    db_utils.CATGRIES[splitKeys[2]](edit, None)
                else:
                    db_utils.CATGRIES[splitKeys[2]](edit, POST[key]) # each entry has varied properties
                print("Table entry modified: (%s)" % str(edit[0]))
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
    return HttpResponse(json.dumps(response))

def updateEntries(request):
    if request.method != 'POST': return HttpResponse("Doesn't work")
    POST = QueryDict.dict(request.POST)
    response = {}
    for key in POST.keys():
        splitKeys = key_utils.splitKey(key)
        boolVal = True if POST[key] == 'true' else False # False should be default to protect against unintended values
        if key_utils.checkKeys(splitKeys):
            entry = EntryEdit.objects.filter(name=splitKeys[2], category=splitKeys[1])
            if not entry.exists() and boolVal: #insert a new object
                entry = EntryEdit(name=splitKeys[2], category=splitKeys[1])
                entry.save()
                print("New entry saved: (%s)" % str(entry))
            elif entry.exists() and not boolVal: #delete an existing object
                entry.update(name=None, category=None)
                print("Deleted object: (%s, %s)" % (splitKeys[1], splitKeys[2]))
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
    return HttpResponse(json.dumps(response))
