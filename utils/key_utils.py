from .date_utils import loadDates
import re, datetime

SUBKEYS = {
                'dates': True,
                'place': True,
                'topic': True,
                'moderator': True,
                'children': True,
                'youth': True,
                'remarks': True
            }

def checkEditsKeys(keys):
    try:
        dateIndex = int(keys[2])
        if dateIndex < 0 or dateIndex >= len(loadDates()): return False
        return keys[3] in SUBKEYS
    except:
        return False

def checkEntriesKeys(keys):
    return keys[2] in SUBKEYS and keys[2] != 'dates' and keys[2] != 'topic' and keys[2] != 'remarks'

POSTTYPES = {
                'edits': checkEditsKeys,
                'entries': checkEntriesKeys
            }

# split the incorrectly formatted key up properly, higher index = more nested in original JSON
def splitKey(key):
    return list(filter(lambda e: e != '', re.split(", ", key)))

# validate that the splitted keys are in proper format
def checkKeys(keys):
    if len(keys) != 4: return False
    try:
        yr = int(keys[1]) # catch potential type error parsing to int
        thisYear = datetime.date.today().year
        if yr < thisYear - 1 or yr > thisYear + 1: return False
    except:
        return False
    if keys[0] not in POSTTYPES: return False
    return POSTTYPES[keys[0]](keys)
