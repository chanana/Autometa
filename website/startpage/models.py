from django.contrib.auth.models import User
from django.db import models
# we're using this to redirect the user once their form for a new job has been
# filled. Redirect takes you to a specific route but reverse just returns the
# url to that route as a string.
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Object relational mapper (ORM) allows access to database in an OOP way. You
# can change databases (like SQLite vs Postgres) by setting it up in the
# settings. The queries will remain the same. We can represent our database
# structure using classes but here in django = they are called models.


class UploadedJobResult(models.Model):
    title = models.CharField(max_length=100)
    result = models.FileField(upload_to='uploaded_results/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return (self.title)


class Metagenome(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # check if date is already included


class Contig(models.Model):
    metagenome = models.ForeignKey(Metagenome, on_delete=models.CASCADE)


class Markers(models.Model):
    marker = models.TextField()
    contig = models.ForeignKey(Contig, on_delete=models.CASCADE)


class Coverage(models.Model):
    coverage = models.FloatField()
    contig = models.ForeignKey(Contig, on_delete=models.CASCADE)


class MajorityVote(models.Model):
    taxid = models.TextField()
    superkingdom = models.TextField()
    phylum = models.TextField()
    class_biology = models.TextField()
    order = models.TextField()
    family = models.TextField()
    genus = models.TextField()
    species = models.TextField()
    contig = models.ForeignKey(Contig, on_delete=models.CASCADE)


class Kmers(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    contig = models.ForeignKey(Contig, on_delete=models.CASCADE)


class MetagenomeAssembledGenome(models.Model):
    # bin id is mag id
    # mag is a bin
    completeness = models.FloatField()
    purity = models.FloatField()
    gc = models.FloatField()
    coverage = models.FloatField()
    gdbtk = models.TextField()
    taxon = models.TextField()
    contig = models.ForeignKey(Contig, on_delete=models.CASCADE)
    metagenome = models.ForeignKey(Metagenome, on_delete=models.CASCADE)


class Pangenome(models.Model):
    completeness = models.FloatField()
    purity = models.FloatField()
    heterogeneity = models.FloatField()
    taxon = models.TextField()
    mag = models.ForeignKey(MetagenomeAssembledGenome,
                            on_delete=models.CASCADE)
    metagenome = models.ForeignKey(Metagenome, on_delete=models.CASCADE)


class Job(models.Model):
    title = models.CharField(max_length=127)
    date_run = models.DateTimeField(default=timezone.now)
    description = models.TextField(default="a job needs a description")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # TODO: not sure if this is a file field or something else. Add the location of config file here (i think)
    # config_file = models.FileField

    # choice for type of job: class implementation allows for easier extensibility
    class TypeOfJob(models.TextChoices):
        BINNING = 'BN', _('Binning')
        PANGENOME = 'PG', _('Pangenome')

    # to get the human-readable version in html, use get_FOO_display where FOO
    # is the field name. In this case, FOO is 'type_of_job'
    # https://docs.djangoproject.com/en/3.0/ref/models/instances/#extra-instance-methods
    type_of_job = models.CharField(
        max_length=2,
        choices=TypeOfJob.choices,
        default=TypeOfJob.BINNING
    )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        # We want to take our user to the job-detail page once they've created
        # their new job. Since the job-detail page url is job/<pk>, we need to
        # specify that we get that back as a string in kwargs.
        return reverse('job-detail', kwargs={'pk': self.pk})
