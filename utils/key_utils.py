from .date_utils import loadDates
import re

SUBKEYS = {
                'newDate': True,
                'place': True,
                'topic': True,
                'moderator': True,
                'children': True,
                'youth': True,
                'remarks': True
            }

def checkEditsKeys(keys):
    try:
        dateIndex = int(keys[1])
        if dateIndex < 0 or dateIndex >= len(loadDates()): return False
        return keys[2] in SUBKEYS
    except:
        return False

def checkEntriesKeys(keys):
    return keys[1] in SUBKEYS and keys[1] != 'newDate' and keys[1] != 'topic' and keys[1] != 'remarks'

POSTTYPES = {
                'edits': checkEditsKeys,
                'entries': checkEntriesKeys
            }

# split the incorrectly formatted key up properly, higher index = more nested in original JSON
def splitKey(key):
    return list(filter(lambda e: e != '', re.split("[\[\]]", key)))

# validate that the splitted keys are in proper format
def checkKeys(keys):
    if len(keys) != 3: return False
    if keys[0] not in POSTTYPES: return False
    return POSTTYPES[keys[0]](keys)
