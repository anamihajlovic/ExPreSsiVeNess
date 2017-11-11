from django.conf.urls import url
from . import views

app_name = 'core'

urlpatterns = [
    url(r'^$', views.index, name="index"),

    url(r'^display_data/(?P<display_id>[a-z]+)$', views.display_data, name="display_data"),

    url(r'^load_file$', views.load_file, name="load_file"),

    url(r'^action$', views.action, name="action"),

]