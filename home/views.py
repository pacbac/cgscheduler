from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from utils import date_utils, key_utils, db_utils
import datetime
import json
from .models import TableEdit, EntryEdit
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def loadPage(request):
    return render(request, 'index.html', {})

def getData(request):
    if request.method != 'GET': return HttpResponse({ 'dataStatus': False })
    thisYear = datetime.date.today().year
    tabs = [ str(thisYear+yr) for yr in range(-1, 2) ]
    response = {
        # key: date in mm/dd/yyyy, value: table edit db obj
        'tableEntries': {},
        'entriesPool': {},
        'dataStatus': True
    }

    entryCategories = ['place', 'moderator', 'children', 'youth']

    for yr in tabs:
        # populate table with default, auto-generated dates first before putting actual entries
        dateList = date_utils.loadDates(startdate=datetime.date(int(yr), 1, 1))
        for tableIndex, date in enumerate(dateList):
            flattenedKey = ", ".join([yr, str(tableIndex), 'dates'])
            response['tableEntries'][flattenedKey] = date

        #populate table edits
        editsLowerBound, editsUpperBound = datetime.date(int(yr), 1, 1), datetime.date(int(yr)+1, 1, 1)
        tableedits = TableEdit.objects.filter(date__gte=editsLowerBound, date__lt=editsUpperBound)
        for edit in tableedits:
            tableIndex = dateList.index(date_utils.dateToStr(edit.date))
            editDict = edit.toDict()

            for ctgry in editDict:
                # flatten the object for entriesPool by combining yr, tableIndex, and category to one key
                flattenedKey = ", ".join([yr, str(tableIndex), (ctgry if ctgry != 'newDate' else 'dates')])
                response['tableEntries'][flattenedKey] = editDict[ctgry]

        #populate entries pool
        for ctgry in entryCategories:
            # flatten the object for entriesPool by combining yr and category to one key
            response['entriesPool'][", ".join([yr, ctgry])] = []
            for entry in EntryEdit.objects.filter(yr=int(yr), category=ctgry):
                response['entriesPool'][yr+", "+ctgry].append(entry.name)

    return HttpResponse(json.dumps(response))

def updateEdits(request):
    if request.method != 'POST': return HttpResponse({ 'dataStatus': False })
    POST = json.loads(request.body.decode('utf-8'))
    response = { 'dataStatus': True } # status = True means post was success
    for key in POST.keys():
        # splitKey input example: '2018, 2, moderator'
        entryYr, dateIndex, ctgry = tuple(key_utils.splitKey(key))
        if (key_utils.checkKeys(['edits', entryYr, dateIndex, ctgry]) and
            not (ctgry == 'dates' and not date_utils.checkDateFormat(POST[key]))): #value checked for invalid date formats
            entryYr, dateIndex = int(entryYr), int(dateIndex)
            origDate = date_utils.loadDates(startdate=datetime.date(entryYr, 1, 1))[dateIndex]
            edit = TableEdit.objects.filter(date__startswith=date_utils.strToDate(origDate))
            if not edit.exists():
                if (not ((ctgry == 'dates' and origDate == POST[key]) # ignore entry if date is just default
                    or (ctgry != 'dates' and POST[key] == ""))): # ignore entry if category is empty
                    edit = TableEdit(date=date_utils.strToDate(origDate))
                    edit.save()
                    db_utils.INSTCATGRIES[ctgry](edit, POST[key])
                    print("New table entry saved: (%s)" % str(edit))
            else:
                logStr = "Table entry modified: (%s)" % str(edit[0])
                if (ctgry == 'dates' and origDate == POST[key]) or (ctgry != 'dates' and POST[key] == ""):
                    db_utils.CATGRIES[ctgry](edit, None)
                    if edit[0].isEmpty():
                        edit.delete()
                        logStr = "Table entry deleted: (%s, %s)" % (origDate, ctgry)
                else:
                    db_utils.CATGRIES[ctgry](edit, POST[key]) # each entry has varied properties
                    logStr = "Table entry modified: (%s)" % str(edit[0])
                print(logStr)
        else:
            response[key] = "Error: Could not post to server due to improper formatting"
            response['dataStatus'] = False
    return HttpResponse(json.dumps(response))

def updateEntries(request):
    if request.method != 'POST': return HttpResponse(json.dumps({ 'dataStatus': False }))
    POST = json.loads(request.body.decode('utf-8'))
    response = { 'dataStatus': True }
    for yr in POST.keys():
        for ctgry in POST[yr]:
            for name in POST[yr][ctgry]:
                boolVal = POST[yr][ctgry][name]
                if key_utils.checkKeys(['entries', yr, ctgry, name]):
                    entry = EntryEdit.objects.filter(yr=yr, name=name, category=ctgry)
                    if not entry.exists() and boolVal: #insert a new object
                        entry = EntryEdit(yr=yr, name=name, category=ctgry)
                        entry.save()
                        print("New entry saved: (%s)" % str(entry))
                    elif entry.exists() and not boolVal: #delete an existing object
                        entry.delete()
                        print("Deleted object: (%s, %s, %s)" % (yr, ctgry, name))
                else:
                    response[yr][ctgry][name] = "Error: Could not post to server due to improper formatting"
                    response['dataStatus'] = False
    return HttpResponse(json.dumps(response))
