from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Object relational mapper (ORM) allows access to database in an OOP way. You
# can change databases (like SQLite vs Postgres) by setting it up in the
# settings. The queries will remain the same. We can represent our database
# structure using classes but here in django = they are called models.


class Job(models.Model):
    title = models.CharField(max_length=127)
    date_run = models.DateTimeField(default=timezone.now)
    descripton = models.TextField(default=f'{title}')
    # TODO: not sure if this is a file field or something else. Add the location of config file here (i think)
    # config_file = models.FileField
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
