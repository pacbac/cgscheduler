from . import date_utils

''' Use when obj is not an instance, but was called with Model.objects.filter(...) '''
def editNewDate(obj, newDate):
    print(obj[0].correctDate)
    obj.update(correctDate=date_utils.strToDate(newDate).__str__())

def editPlace(obj, newPlace):
    obj.update(place=newPlace)

def editTopic(obj, newTopic):
    obj.update(topic=newTopic)

def editMod(obj, newMod):
    obj.update(moderator=newMod)

def editChil(obj, newChil):
    obj.update(children=newChil)

def editYouth(obj, newYouth):
    obj.update(youth=newYouth)

def editRemarks(obj, newRemarks):
    obj.update(remarks=newRemarks)

CATGRIES = {
                'newDate': editNewDate,
                'place': editPlace,
                'topic': editTopic,
                'moderator': editMod,
                'children': editChil,
                'youth': editYouth,
                'remarks': editRemarks
            }

''' Use to edit an instance '''
def editInstNewDate(inst, newDate):
    inst.correctDate = date_utils.strToDate(newDate).__str__()
    inst.save(update_fields=['correctDate'])

def editInstPlace(inst, newPlace):
    inst.place = newPlace
    inst.save(update_fields=['place'])

def editInstTopic(inst, newTopic):
    inst.topic = newTopic
    inst.save(update_fields=['topic'])

def editInstMod(inst, newMod):
    inst.moderator = newMod
    inst.save(update_fields=['moderator'])

def editInstChil(inst, newChil):
    inst.children = newChil
    inst.save(update_fields=['children'])

def editInstYouth(inst, newYouth):
    inst.youth = newYouth
    inst.save(update_fields=['youth'])

def editInstRemarks(inst, newRemarks):
    inst.remarks = newRemarks
    inst.save(update_fields=['remarks'])

INSTCATGRIES = {
                'newDate': editInstNewDate,
                'place': editInstPlace,
                'topic': editInstTopic,
                'moderator': editInstMod,
                'children': editInstChil,
                'youth': editInstYouth,
                'remarks': editInstRemarks
            }
