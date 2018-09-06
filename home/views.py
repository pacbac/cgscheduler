from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from utils import date_utils, key_utils, db_utils
import datetime
import json
from .models import TableEdit, EntryEdit
from django.views.decorators.csrf import ensure_csrf_cookie

def index(request):
    thisYear = datetime.date.today().year
    tabs = [ str(thisYear+yr) for yr in range(-1, 2) ]
    context = {
        'categories': ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks'],
        'dates': { yr: date_utils.loadDates(startdate=datetime.date(int(yr), 1, 1)) for yr in tabs },
        'edits': {}, # key: date in mm/dd/yyyy, value: table edit db obj
        'tabs': tabs,
        'entries': { yr: {'place': [], 'moderator': [], 'children': [], 'youth': []} for yr in tabs }
    }

    for yr in tabs:
        #populate table edits
        editsLowerBound, editsUpperBound = datetime.date(int(yr), 1, 1), datetime.date(int(yr)+1, 1, 1)
        tableedits = TableEdit.objects.filter(date__gte=editsLowerBound, date__lt=editsUpperBound)
        context['edits'][yr] = { date_utils.dateToStr(edit.date): edit.toDict() for edit in tableedits }
        #populate entries pool
        for ctgry in context['entries'][yr]:
            for entry in EntryEdit.objects.filter(yr=int(yr), category=ctgry):
                context['entries'][yr][ctgry].append(entry.name)

    return HttpResponse(json.dumps(context))

def updateEdits(request):
    if request.method != 'POST': return HttpResponse("Doesn't work")
    POST = QueryDict.dict(request.POST)
    response = { 'status': True } # status = True means post was success
    for key in POST.keys():
        # splitKey is always in the form {0: 'edits', 1: 'yr', 2: 'dateIndex', 3: 'category'}
        splitKeys = tuple(key_utils.splitKey(key))
        ctgry = splitKeys[3]
        if (key_utils.checkKeys(splitKeys) and
            not (ctgry == 'newDate' and not date_utils.checkDateFormat(POST[key]))): #value checked for invalid date formats
            entryYr, dateIndex = splitKeys[1], splitKeys[2]
            entryYr, dateIndex = int(entryYr), int(dateIndex)
            origDate = date_utils.loadDates(startdate=datetime.date(entryYr, 1, 1))[dateIndex]
            edit = TableEdit.objects.filter(date__startswith=date_utils.strToDate(origDate))
            if not edit.exists():
                if (not ((ctgry == 'newDate' and origDate == POST[key]) # ignore entry if date is just default
                    or (ctgry != 'newDate' and POST[key] == ""))): # ignore entry if category is empty
                    edit = TableEdit(date=date_utils.strToDate(origDate))
                    edit.save()
                    db_utils.INSTCATGRIES[ctgry](edit, POST[key])
                    print("New table entry saved: (%s)" % str(edit))
            else:
                logStr = "Table entry modified: (%s)" % str(edit[0])
                if (ctgry == 'newDate' and origDate == POST[key]) or (ctgry != 'newDate' and POST[key] == ""):
                    db_utils.CATGRIES[ctgry](edit, None)
                    if edit[0].isEmpty():
                        edit.delete()
                        logStr = "Table entry deleted: (%s, %s)" % (origDate, ctgry)
                else:
                    db_utils.CATGRIES[ctgry](edit, POST[key]) # each entry has varied properties
                print(logStr)
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
            response['status'] = False
    return HttpResponse(json.dumps(response))

def updateEntries(request):
    if request.method != 'POST': return HttpResponse("Doesn't work")
    POST = QueryDict.dict(request.POST)
    response = { 'status': True }
    for key in POST.keys():
        splitKeys = tuple(key_utils.splitKey(key)) # splitKeys should look like {0: entries, 1: yr, 2: category, 3: personName }
        boolVal = True if POST[key] == 'true' else False # False should be default to protect against unintended values
        if key_utils.checkKeys(splitKeys):
            yr, ctgry, name = splitKeys[1:]
            entry = EntryEdit.objects.filter(yr=yr, name=name, category=ctgry)
            if not entry.exists() and boolVal: #insert a new object
                entry = EntryEdit(yr=yr, name=name, category=ctgry)
                entry.save()
                print("New entry saved: (%s)" % str(entry))
            elif entry.exists() and not boolVal: #delete an existing object
                entry.delete()
                print("Deleted object: (%s, %s, %s)" % (yr, ctgry, name))
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
            response['status'] = False
    return HttpResponse(json.dumps(response))
