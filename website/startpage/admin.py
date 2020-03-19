from django.contrib import admin
from .models import (Job, Pangenome, MetagenomeAssembledGenome,
                     Kmers, MajorityVote, Coverage, Markers, Contig, Metagenome)
# Register your models here.
admin.site.register([Job, Pangenome, MetagenomeAssembledGenome,
                     Kmers, MajorityVote, Coverage, Markers, Contig, Metagenome])
