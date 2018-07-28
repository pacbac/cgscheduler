from django.db import models
import datetime
from utils import parseDate

# Create your models here.
class Edit(models.Model):
    date = models.DateField()
    place = models.CharField(max_length=20, blank=True)
    moderator = models.CharField(max_length=20, blank=True)
    topic = models.CharField(max_length=75, blank=True)
    children = models.CharField(max_length=20, blank=True)
    remarks = models.CharField(max_length=100, blank=True)

    def __str__(self):
        propArr = [parseDate.dateToStr(self.date)]
        if self.place: propArr.append("Place: " + self.place)
        if self.moderator: propArr.append("Mod: " + self.moderator)
        if self.topic: propArr.append("Topic: " + self.topic)
        if self.children: propArr.append("Children: " + self.children)
        if self.remarks: propArr.append("Remarks:" + self.remarks)
        return ", ".join(propArr)

class Entry(models.Model):
    name = models.CharField(max_length=20) #name of person in entry
    category = models.CharField(max_length=75) #what category they belong to

    def __str__(self):
        return "%s %s" % (self.name, self.category)
