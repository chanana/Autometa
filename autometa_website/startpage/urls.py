from django.urls import path
from . import views
from .views import (
    JobListView,
    JobDetailView,
    JobCreateView,
    JobUpdateView,
    JobDeleteView,
    UserJobListView,
)

urlpatterns = [
    # path('', views.startpage, name='startpage-home'),
    path('', JobListView.as_view(), name='startpage-home'),
    path('user/<str:username>', UserJobListView.as_view(), name='user-jobs'),
    # make a dynamic url pattern. pk is primary key
    path('job/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('job/new/', JobCreateView.as_view(), name='job-create'),
    path('job/<int:pk>/update/', JobUpdateView.as_view(), name='job-update'),
    path('job/<int:pk>/delete/', JobDeleteView.as_view(), name='job-delete'),
    path('about/', views.about, name='startpage-about'),
]
