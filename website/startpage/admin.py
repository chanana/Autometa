from django.contrib import admin
import startpage.models as m

admin.site.register([m.Uploads, m.Job, m.Pangenome, m.MetagenomeAssembledGenome,
                     m.Kmers, m.MajorityVote, m.Coverage, m.Markers, m.Contig, m.Metagenome])
