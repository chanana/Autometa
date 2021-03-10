from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Uploads(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    description = models.TextField(
        default="A file needs a description.", blank=True
    )
    file = models.FileField(upload_to="uploads/")
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        self.file.delete()
        super().delete(*args, **kwargs)


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
    mag = models.ForeignKey(
        MetagenomeAssembledGenome, on_delete=models.CASCADE
    )
    metagenome = models.ForeignKey(Metagenome, on_delete=models.CASCADE)


class Job(models.Model):
    title = models.CharField(max_length=127)
    date_run = models.DateTimeField(default=timezone.now)
    description = models.TextField(default="a job needs a description")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # TODO: not sure if this is a file field or something else. Add the
    # location of config file here (i think) config_file = models.FileField

    # choice for type of job: class implementation allows for easier
    # extensibility
    class TypeOfJob(models.TextChoices):
        BINNING = "BN", _("Binning")
        PANGENOME = "PG", _("Pangenome")

    # to get the human-readable version in html, use get_FOO_display where FOO
    # is the field name. In this case, FOO is 'type_of_job'
    # https://docs.djangoproject.com/en/3.0/ref/models/instances/#extra-instance-methods
    type_of_job = models.CharField(
        max_length=2, choices=TypeOfJob.choices, default=TypeOfJob.BINNING
    )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        # We want to take our user to the job-detail page once they've created
        # their new job. Since the job-detail page url is job/<pk>, we need to
        # specify that we get that back as a string in kwargs.
        return reverse("job-detail", kwargs={"pk": self.pk})


# class NewJob(models.Model): title = models.CharField(max_length=127) date_run
#     = models.DateTimeField(default=timezone.now) description =
#     models.TextField(default="a job needs a description") user =
#     models.ForeignKey(User, on_delete=models.CASCADE) # [files] # metagenome
#     = metagenome.fna metagenome =
#     models.FileField(upload_to='uploads/job_input/metagenomes/') Multiple
#     Reads files of respective format may be provided using a comma-delimiter
#     TODO: Ask evan which fields are required. also ask about the fields at
#     the bottom that don't have fields setup yet.

#     AT LEAST ONE
#     # fwd_reads = fwd_reads.fastq, fwd_reads.fastq
#     fwd_reads = models.FileField(upload_to='uploads/job_input/fwd_reads/')
#     # rev_reads = rev_reads.fastq
#     rev_reads = models.FileField(upload_to='uploads/job_input/rev_reads/')
#     # se_reads = se_reads.fastq
#     se_reads = models.FileField(upload_to='uploads/job_input/se_reads/')
#     # sam = alignments.sam
#     sam = models.FileField(upload_to='uploads/job_input/sam/')
#     # bam = alignments.bam
#     bam = models.FileField(upload_to='uploads/job_input/bam/')

#     # lengths = lengths.tsv
#     lengths = models.FileField(upload_to='uploads/job_input/lengths/')
#     # bed = alignments.bed
#     bed = models.FileField(upload_to='uploads/job_input/bed/')
#     # length_filtered = metagenome.filtered.fna
#     length_filtered = models.FileField(
#         upload_to='uploads/job_input/length_filtered/')
#     # coverages = coverages.tsv
#     coverages = models.FileField(upload_to='uploads/job_input/coverages/')
#     # kmer_counts = kmers.tsv
#     kmer_counts = models.FileField(
#         upload_to='uploads/job_input/kmer_counts/')
#     # kmer_normalized = kmers.normalized.tsv
#     kmer_normalized = models.FileField(
#         upload_to='uploads/job_input/kmer_normalized/')
#     # kmer_embedded = kmers.embedded.tsv
#     kmer_embedded = models.FileField(
#         upload_to='uploads/job_input/kmer_embedded/')
#     # nucleotide_orfs = metagenome.filtered.orfs.fna
#     nucleotide_orfs = models.FileField(
#         upload_to='uploads/job_input/nucleotide_orfs/')
#     # amino_acid_orfs = metagenome.filtered.orfs.faa
#     amino_acid_orfs = models.FileField(
#         upload_to='uploads/job_input/amino_acid_orfs/')
#     # blastp = blastp.tsv
#     blastp = models.FileField(upload_to='uploads/job_input/blastp/')
#     # blastp_hits = blastp.hits.pkl.gz
#     blastp_hits = models.FileField(
#         upload_to='uploads/job_input/blastp_hits/')
#     # blastx = blastx.tsv
#     blastx = models.FileField(upload_to='uploads/job_input/blastx/')
#     # taxonomy = taxonomy.tsv
#     taxonomy = models.FileField(upload_to='uploads/job_input/taxonomy/')
#     # bacteria_hmmscan = bacteria.hmmscan.tsv
#     bacteria_hmmscan = models.FileField(
#         upload_to='uploads/job_input/bacteria_hmmscan/')
#     # bacteria_markers = bacteria.markers.tsv
#     bacteria_markers = models.FileField(
#         upload_to='uploads/job_input/bacteria_markers/')
#     # archaea_hmmscan = archaea.hmmscan.tsv
#     archaea_hmmscan = models.FileField(
#         upload_to='uploads/job_input/archaea_hmmscan/')
#     # archaea_markers = archaea.markers.tsv
#     archaea_markers = models.FileField(
#         upload_to='uploads/job_input/archaea_markers/')
#     # binning = binning.tsv
#     binning = models.FileField(upload_to='uploads/job_input/binning/')
#     # checkpoints = checkpoints.tsv
#     checkpoints = models.FileField(
#         upload_to='uploads/job_input/checkpoints/')

#     # [parameters]
#     # workspace = <required>
#     # project = 1
#     # metagenome_num = 0

#     # kingdom = bacteria
# https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1691724/pdf/15306349.pdf

#     KINGDOM_CHOICES = [
#         ('BCT', 'Bacteria'),
#         ('PRZ', 'Protozoa'),
#         ('ANL', 'Animalia'),
#         ('FNG', 'Fungi'),
#         ('PLT', 'Plantae')
#     ]
#     kingdom = models.CharField(
#         choices=KINGDOM_CHOICES,
#         default=KINGDOM_CHOICES.BCT
#     )
#     # length_cutoff = 3000
#     length_cutoff = models.PositiveIntegerField()
#     # cov_from_spades = False
#     cov_from_spades = models.BooleanField(default=False)

#     # kmer_size = 5 # might be
#     KMER_CHOICES = [(i, i) for i in range(3:10)]
#     kmer_size = models.IntegerField(
#         choices=KMER_CHOICES,
#         default=(5, 5)
#     )
#     # kmer_multiprocess = True
#     kmer_multiprocess = models.BooleanField(default=True)
#     # kmer_normalize = True
#     kmer_normalize = models.BooleanField(default=True)
#     # do_pca = True
#     do_pca = models.BooleanField(default=True)
#     # pca_dims = 50
#     pca_dims = models.IntegerField(default=50)

#     # embedding_method = UMAP
#     EMBEDDING_METHOD_CHOICES = [
#         ('UMAP', 'UMAP'),
#         ('TMAP', 'TMAP'),
#         ('BHTSNE', 'BH-tSNE')
#     ]
#     embedding_method = models.TextField(
#         choices=EMBEDDING_METHOD_CHOICES,
#         default=EMBEDDING_METHOD_CHOICES.UMAP
#     )
#     # taxon_method = majority_vote
#     # taxon_method = models.
#     # reversed = True
#     is_reversed = models.BooleanField(default=True)
#     # binning_method = recursive_dbscan
#     # binning_method = models.
#     # completeness = 20.0
#     completeness = models.FloatField(default=20.0)
#     # purity = 90.0
#     purity = models.FloatField(default=90.0)
#     # verbose = False
#     verbose = models.BooleanField(default=False)
#     # force = False
#     force = models.BooleanField(default=False)
#     # usepickle = True
#     usepickle = models.BooleanField(default=True)
#     # parallel = False
#     parallel = models.BooleanField(default=True)
#     # cpus = 1
#     cpus = models.IntegerField(default=1)
