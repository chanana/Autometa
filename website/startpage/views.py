# in order to only allow new jobs to be created if logged in, we can use
# decorators on fucntion based views but for class based views, we need mixin
from django.contrib.auth.mixins import LoginRequiredMixin
# even though the user is logged in, what if they just want to modify someone
# else's job. The mixin below makes sure that the user logged in also owns the
# job they're trying to modify.
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render
from django.views.generic import (CreateView, DeleteView, DetailView, ListView,
                                  UpdateView, FormView)
import django_tables2 as tables
from .models import Job
from .forms import SubmitResultsForm
from django.http import HttpResponseRedirect
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from django.urls import reverse


class UploadResultsView(FormView):
    template_name = 'startpage/upload_result.html'
    form_class = SubmitResultsForm

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests: instantiate a form instance with the passed
        POST variables and then check if it's valid.
        """
        form = self.get_form()
        if form.is_valid():
            uploaded_file = request.FILES['file']
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            print(f'filename: {name}')  # debug purposes
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    # came in handy: https://www.youtube.com/watch?v=HSn-e2snNc8 also:
    # https://github.com/sibtc/django-upload-example/blob/master/mysite/core/views.py
    # for handling large files maybe? def handle_submitted_file(self, form): f =
    # form. with open('some/file/name.txt', 'wb+') as destination: for chunk in
    # f.chunks(): destination.write(chunk)

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS,
                             'Your file was uploaded successfully!')
        # possible useful answer: https://stackoverflow.com/a/54965061
        return reverse('startpage-home')


class ResultsView(CreateView):
    pass

    # TODO: make this into a fancy page showing what is happening to the submitted
    # job or something?


class JobInProgressView(CreateView):
    template_name = 'startpage/job_in_progress.html'


def upload(request):
    context = {}
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        # to view the file, use the MEDIA_URL (from settings.py) before the name of the file.

        # if we wanted to show the user the file they uploaded, we can:
        name = fs.save(uploaded_file.name, uploaded_file)
        # we could've used the uploaded_file.name but if the user uploads a file
        # with a name that already exists in the media folder, then we won't get
        # the right file name
        url = fs.url(name)
        context['url'] = url
    return render(request, 'startpage/upload.html', context=context)


class JobListView(LoginRequiredMixin, ListView):
    # LoginRequiredMixin ensures that this view is only visible if the user is
    # logged in. redefined get_queryset method filters the queryset for the
    # current user.
    model = Job
    # expected default format for template is <app>/<model>_<viewtype>.html
    template_name = "startpage/home.html"
    ordering = ['-date_run', 'type_of_job']
    context_object_name = 'jobs'
    paginate_by = 5

    # Why don't we use the test_func and @user_passes_test functionality here?
    # Answer:
    # https://stackoverflow.com/questions/55628920/test-func-for-userpassestestmixin-with-get-object-does-not-work-with-listview
    def get_queryset(self):
        return super(JobListView, self).get_queryset().filter(user=self.request.user)


class JobDetailView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    # normally expects template as <app>/<model>_confirm_delete.html
    model = Job

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to the owner of job
        return self.request.user == job.user


class JobCreateView(LoginRequiredMixin, CreateView):
    model = Job
    # template expected is <app>/<model>_form.html
    fields = ['title', 'description']

    # redefine form validation method and make it so that the default user is the one logged in
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class JobUpdateView(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    model = Job
    # template expected is <app>/<model>_form.html
    fields = ['title', 'description']

    # redefine form validation method and make it so that the default user is the one logged in
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def test_func(self):
        job = self.get_object()
        # get the job object being upgdated and return true if it's equal to the owner of job
        return self.request.user == job.user


class JobDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = Job
    success_url = '/'

    def test_func(self):
        job = self.get_object()
        # get the job object being accessed and return true if it's equal to the owner of job
        return self.request.user == job.user


def about(request):
    return render(request, 'startpage/about.html', context={'title': 'about autometa'})
