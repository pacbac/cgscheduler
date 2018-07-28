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
