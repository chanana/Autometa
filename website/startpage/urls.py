from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.UploadView.as_view(), name='upload'),
    path('upload_list/', views.UploadListView.as_view(), name='upload_list'),
    path('upload_list/<int:pk>/', views.delete_file, name='delete_file'),
    path('upload_list/<int:pk>/visualize',
         views.UploadDetailView.as_view(), name='visualize'),
    # path('upload/', views.uploadResults, name='upload'),
    # path('visualize/', VisualizeResultsView.as_view(), name='visualize'),
    # path('', views.startpage, name='startpage-home'),
    path('', views.JobListView.as_view(), name='startpage-home'),
    # path('user/<str:username>', UserJobListView.as_view(), name='user-jobs'),
    # make a dynamic url pattern. pk is primary key
    path('job/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('job/new/', views.JobCreateView.as_view(), name='job-create'),
    path('job/<int:pk>/update/', views.JobUpdateView.as_view(), name='job-update'),
    path('job/<int:pk>/delete/', views.JobDeleteView.as_view(), name='job-delete'),
    path('about/', views.about, name='startpage-about'),
]
