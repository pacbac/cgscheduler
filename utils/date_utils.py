import datetime

def dateToStr(date):
    dateArr = date.__str__().split("-") # year-mo-da format
    yr = dateArr.pop(0)
    dateArr.append(yr)
    newStr = "/".join(dateArr) #turn into mo/da/year
    if newStr[0] == '0': newStr = newStr[1:] #take off a 0 if mo < 10
    return newStr

def strToDate(str):
    dateArr = str.split("/")
    dateArr = list(map(lambda e: int(e), dateArr))
    return datetime.date(dateArr[2], dateArr[0], dateArr[1])

# check if key is a date
def checkDateFormat(key):
    splitDate = key.split("/")
    if len(splitDate) != 3: return False
    month, day, year = splitDate
    try:
        testDate = datetime.date(int(year), int(month), int(day))
        return True
    except:
        return False

def loadDates(startdate=datetime.date(datetime.date.today().year, 1, 1)):
    dateArr = []

    def getSaturday(date):
        wkDay = 0 if date.isoweekday() == 7 else date.isoweekday()
        if date.day <= 14:
            return date.replace(day=14-wkDay)
        elif date.day <= 28:
            return date.replace(day=28-wkDay)
        return date.replace(day=42-wkDay)

    i = 0
    while True:
        try:
            addThisDate = getSaturday(datetime.date(startdate.year, startdate.month+int(i/2), 1 if i % 2 == 0 else 15))
            dateArr.append(dateToStr(addThisDate))
            i+=1
        except:
            return dateArr
