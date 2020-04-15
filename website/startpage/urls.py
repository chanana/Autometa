from django.urls import path
from . import views

urlpatterns = [
    # Home page
    path('', views.JobListView.as_view(), name='startpage-home'),
    # About Page
    path('about/', views.about, name='startpage-about'),

    # Creation
    path('job/new/', views.JobCreateView.as_view(), name='job-create'),
    path('uploads/', views.UploadsCreateView.as_view(), name='uploads'),

    # List
    path('uploads_list', views.UploadsListView.as_view(), name='uploads-list'),
    path('uploads_list/<int:pk>/visualize',
         views.VisualizeResultsView.as_view(), name='visualize'),
    # # List table Version
    # path('uploads_table/', views.UploadsTableView.as_view(), name='uploads-table'),
    # path('uploads_table/<int:pk>/visualize',
    #      views.VisualizeResultsView.as_view(), name='visualize-table'),

    # Detail
    path('job/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('uploads/<int:pk>/', views.UploadsDetailView.as_view(),
         name='uploads-detail'),

    # Update
    path('job/<int:pk>/update/', views.JobUpdateView.as_view(), name='job-update'),

    # Deletion
    path('job/<int:pk>/delete/', views.JobDeleteView.as_view(), name='job-delete'),
    path('uploads/<int:pk>/delete/',
         views.UploadsDeleteView.as_view(), name='uploads-delete'),
    # path('uploads_table/<int:pk>/delete/',
    #      views.UploadsDeleteView.as_view(), name='uploads-delete'),
]
