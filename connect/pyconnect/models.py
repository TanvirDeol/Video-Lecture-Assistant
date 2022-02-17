from django.db import models

# Create your models here.
class pyConnect(models.Model):
    link = models.TextField()
    keywords = models.TextField()
    result = models.JSONField()