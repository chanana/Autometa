from django import forms
from .models import Uploads  # , NewJob


class UploadsForm(forms.ModelForm):
    class Meta:
        model = Uploads
        exclude = ('user', )


# class NewJobForm(forms.ModelForm):
#     class Meta:
#         model = NewJob
#         exclude = ('user', )

# class NewJobForm(forms.Form):
#     resume = forms.BooleanField(initial=False)
#     kingdom = forms.CharField(strip=True)
#     length_cutoff = forms.IntegerField(initial=3000)
#     cov_from_spades = forms.BooleanField(initial=False)
#     kmer_size = forms.IntegerField(initial=5)
#     kmer_multiprocess = forms.BooleanField(initial=True)
#     kmer_normalize = forms.BooleanField(initial=True)
#     do_pca = forms.BooleanField(initial=False)
#     pca_dims = forms.IntegerField(initial=50)
#     embedding_method = forms.ChoiceField(
#         choices=("UMAP", "tSNE", "TMAP"), initial="tSNE")
#     taxon_method = forms.ChoiceField(
#         choices=("majority_vote", "random"), initial="majority_vote")
#     reversed = forms.BooleanField(initial=True)
#     binning_method = forms.ChoiceField(
#         choices=("recursive_dbscan", "recursive_dbscan"), initial="recursive_dbscan")
#     completeness = forms.FloatField(
#         max_value=100., min_value=0., initial=20.)
#     purity = forms.FloatField(
#         max_value=100., min_value=0., initial=90.)
#     verbose = forms.BooleanField(initial=True)
#     force = forms.BooleanField(initial=False)
#     use_pickle = forms.BooleanField(initial=True)
#     parallel = forms.BooleanField(initial=True)
#     cpus = forms.IntegerField(initial=1, min_value=1)
