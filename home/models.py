from django.db import models
import datetime

# Create your models here.
class Event(models.Model):
    date = models.DateField()
    place = models.CharField(max_length=20, default="N/A")
    moderator = models.CharField(max_length=20, default="N/A")
    topic = models.CharField(max_length=75)
    children = models.CharField(max_length=20, default="N/A")
    remarks = models.CharField(max_length=100, default="")

    def __str__(self):
        print("%s: \nWhere: %s \nModerator: %s \n Topic: %s \n Children: %s \n Remarks: %s" % (date, place, moderator, topic, children, remarks))
