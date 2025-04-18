from django.urls import path
from . import views

urlpatterns = [
    path('',views.card_movie_data, name='card_movie_data'),    # 1
    path('all',views.all_movie_data, name='all_movie_data'),
    path('receive-data/', views.search_receive_data, name='receive_data'),
    path('selected_movie/',views.specific_movie_data,name='specific_movie_data'),
    path('filter/',views.filter_movie_data,name='filter_data'),
    path('addrev/',views.addreview,name='add_review')
]

