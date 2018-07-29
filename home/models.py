from django.db import models
import datetime
from utils import date_utils

# Model for edits in the table
class TableEdit(models.Model):
    date = models.DateField()
    correctDate = models.DateField(blank=True, null=True)
    place = models.CharField(max_length=20, blank=True, null=True)
    moderator = models.CharField(max_length=20, blank=True, null=True)
    topic = models.CharField(max_length=75, blank=True, null=True)
    youth = models.CharField(max_length=20, blank=True, null=True)
    children = models.CharField(max_length=20, blank=True, null=True)
    remarks = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        propArr = [date_utils.dateToStr(self.date)]
        if self.correctDate: propArr.append("newDate: " + self.correctDate)
        if self.place: propArr.append("Place: " + self.place)
        if self.moderator: propArr.append("Mod: " + self.moderator)
        if self.topic: propArr.append("Topic: " + self.topic)
        if self.youth: propArr.append("Youth: " + self.youth)
        if self.children: propArr.append("Children: " + self.children)
        if self.remarks: propArr.append("Remarks: " + self.remarks)
        return ", ".join(propArr)

    def toDict(self):
        d = {}
        if self.correctDate: d['newDate'] = date_utils.dateToStr(self.correctDate)
        if self.place: d['place'] = self.place
        if self.moderator: d['moderator'] = self.moderator
        if self.topic: d['topic'] = self.topic
        if self.youth: d['youth'] = self.youth
        if self.children: d['children'] = self.children
        if self.remarks: d['remarks'] = self.remarks
        return d

# Model for edits in the entry pool
class EntryEdit(models.Model):
    name = models.CharField(max_length=20) #name of person in entry
    category = models.CharField(max_length=75) #what category they belong to

    def __str__(self):
        return "%s %s" % (self.name, self.category)
