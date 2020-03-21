from django.contrib import admin
from .models import (UploadedJobResult, Job, Pangenome, MetagenomeAssembledGenome,
                     Kmers, MajorityVote, Coverage, Markers, Contig, Metagenome)
# Register your models here.
admin.site.register([UploadedJobResult, Job, Pangenome, MetagenomeAssembledGenome,
                     Kmers, MajorityVote, Coverage, Markers, Contig, Metagenome])
