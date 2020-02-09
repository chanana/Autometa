from django.shortcuts import render
from .models import Job


def startpage(request):
    context = {'job': Job.objects.all()}
    return render(request, 'startpage/home.html', context)


def about(request):
    return render(request, 'startpage/about.html', context={'title': 'about autometa'})
