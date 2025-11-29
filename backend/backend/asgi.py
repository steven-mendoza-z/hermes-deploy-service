# backend/asgi.py
import os

# 1) Configurar settings ANTES de importar nada de Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# 2) Inicializar Django (carga settings, apps, modelos, etc.)
django_asgi_app = get_asgi_application()

# 3) AHORA sí podemos importar routing, que usa models / consumers
import registry.routing

# 4) ASGI application
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            registry.routing.websocket_urlpatterns
        )
    ),
})
