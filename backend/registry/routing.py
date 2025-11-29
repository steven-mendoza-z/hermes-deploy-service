from django.urls import re_path
from . import consumers 

websocket_urlpatterns = [
    re_path(r"^ws/shell/(?P<server_id>\d+)/$", consumers.SSHConsumer.as_asgi()),
]
