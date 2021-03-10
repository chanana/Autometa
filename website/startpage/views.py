# from django_tables2 import SingleTableView
# from django.contrib import messages
# from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin

# from django.contrib.auth.models import User
from django.contrib.messages.views import SuccessMessageMixin

# from django.core.files.storage import FileSystemStorage
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import (
    CreateView,
    DeleteView,  # FormView,
    DetailView,
    ListView,
    UpdateView,
)
from django.views.generic.edit import FormMixin

from .forms import UploadsForm
from .models import Job, Uploads

# from .tables import UploadsTable


# class UploadsTableView(LoginRequiredMixin, SingleTableView):
#     model = Uploads
#     table_class = UploadsTable
#     template_name = 'startpage/uploads_table_list.html'
#     ordering = ['date_uploaded']


class JobListView(LoginRequiredMixin, ListView):
    # LoginRequiredMixin ensures that this view is only visible if the user is
    # logged in. redefined get_queryset method filters the queryset for the
    # current user.
    model = Job
    # expected default format for template is <app>/<model>_<viewtype>.html
    template_name = "startpage/home.html"
    ordering = ["-date_run", "type_of_job"]
    context_object_name = "jobs"
    paginate_by = 5

    # Why don't we use the test_func and @user_passes_test functionality here?
    # Answer:
    # https://stackoverflow.com/questions/55628920/test-func-for-userpassestestmixin-with-get-object-does-not-work-with-listview
    def get_queryset(self):
        return (
            super(JobListView, self)
            .get_queryset()
            .filter(user=self.request.user)
        )


class UploadsListView(LoginRequiredMixin, ListView):
    model = Uploads
    template_name = "startpage/upload_list.html"
    context_object_name = "files"
    ordering = ["-date_uploaded"]


class JobDetailView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    # normally expects template as <app>/<model>_confirm_delete.html
    model = Job

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to
        # the owner of job
        return self.request.user == job.user


class UploadsDetailView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    # normally expects template as <app>/<model>_confirm_delete.html
    model = Uploads

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to
        # the owner of job
        return self.request.user == job.user


class VisualizeResultsView(
    UserPassesTestMixin, LoginRequiredMixin, DetailView
):
    # normally expects template as <app>/<model>_confirm_delete.html
    model = Uploads
    template_name = "startpage/visualize.html"

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to
        # the owner of job
        return self.request.user == job.user


class JobCreateView(LoginRequiredMixin, CreateView):
    model = Job
    # template expected is <app>/<model>_form.html
    fields = ["title", "description"]

    # redefine form validation method and make it so that the default user is
    # the one logged in
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class UploadsCreateView(SuccessMessageMixin, CreateView):
    model = Uploads
    form_class = UploadsForm
    success_url = reverse_lazy("uploads-list")
    template_name = "startpage/uploads.html"
    ordering = ["-date_uploaded"]

    # add the user that uploaded the file to the user field.
    # from here: https://gist.github.com/sleekslush/1667396
    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return FormMixin.form_valid(self, form)


class JobUpdateView(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    model = Job
    # template expected is <app>/<model>_form.html
    fields = ["title", "description"]

    # redefine form validation method and make it so that the default user is
    # the one logged in
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def test_func(self):
        job = self.get_object()
        # get the job object being upgdated and return true if it's equal to
        # the owner of job
        return self.request.user == job.user


class JobDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = Job
    success_url = "/"

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to
        # the owner of job
        return self.request.user == job.user


class UploadsDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = Uploads
    success_url = reverse_lazy("uploads-list")

    def test_func(self):
        file = self.get_object()
        return self.request.user == file.user

    def delete(self, request, *args, **kwargs):
        """
        Call the delete() method on the fetched object and then redirect to the
        success URL.
        """
        self.object = self.get_object()
        success_url = self.get_success_url()
        self.object.delete()
        return HttpResponseRedirect(success_url)


# def delete_file(request, pk):
#     if request.method == 'POST':
#         file = Uploads.objects.get(pk=pk)
#         file.delete()
#     return redirect('upload_list')
#     # possible class-based implementation here:
# https://stackoverflow.com/a/9423819


def about(request):
    return render(
        request, "startpage/about.html", context={"title": "about autometa"}
    )
