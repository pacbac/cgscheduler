from .date_utils import checkDateFormat
import re

SUBKEYS = {
                'edits': True, # when split used on POSt request, edits/entries become keys
                'entries': True,
                'newDate': True,
                'place': True,
                'topic': True,
                'moderator': True,
                'children': True,
                'youth': True,
                'remarks': True
            }

# split the incorrectly formatted key up properly, higher index = more nested in original JSON
def splitKey(key):
    return list(filter(lambda e: e != '', re.split("[\[\]]", key)))

# validate that the splitted keys are in proper format
def checkKeys(keys):
    for key in keys:
        try:
            SUBKEYS[key]
        except KeyError:
            if not checkDateFormat(key): return False
    return True
