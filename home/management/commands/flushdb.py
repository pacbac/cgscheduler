from django.core.management.base import BaseCommand, CommandError
from home.models import TableEdit, EntryEdit
import datetime

#Prevent mem leaks for data that will not show up on the scheduler ever again (aka all data from 2 years ago)
class Command(BaseCommand):
    help = 'Flush data from 2 years ago.'

    def handle(self, *args, **kwargs):
        yr = int(datetime.date.today().year) - 2
        editsLowerBound, editsUpperBound = datetime.date(yr, 1, 1), datetime.date(yr+1, 1, 1)
        TableEdit.objects.filter(date__gte=editsLowerBound, date__lt=editsUpperBound).delete()
        print("Flushed data from %s" % yr)
