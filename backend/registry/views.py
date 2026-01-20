# deploy/views.py
from rest_framework import viewsets, permissions
from rest_framework.viewsets import ModelViewSet
from django.db.models import Prefetch
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .core.server import is_server_up

from hermes.core.models import Server as HermesServer
from hermes.internal.setup import set_server as hermes_set_server
from hermes.internal.funcs import run_serverside

from .models import App, Image, Repo, Server, Env, EnvVar
from .serializers import (
    AppSerializer,
    ImageSerializer,
    RepoSerializer,
    ServerSerializer,
    EnvSerializer,
    EnvVarSerializer,
)
from registry.core.server import set_server_conection


class DefaultAllowAny(permissions.AllowAny):
    """Permite acceso público a los endpoints."""
    pass


# ---------- App ----------

class AppViewSet(ModelViewSet):
    permission_classes = [DefaultAllowAny]
    serializer_class = AppSerializer

    # select_related para evitar N+1 con repo y server
    queryset = App.objects.select_related("repo", "server")


# ---------- Image ----------

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.select_related("repository")
    serializer_class = ImageSerializer
    permission_classes = [DefaultAllowAny]


# ---------- Repo ----------

class RepoViewSet(viewsets.ModelViewSet):
    queryset = Repo.objects.all()
    serializer_class = RepoSerializer
    permission_classes = [DefaultAllowAny]


# ---------- Env ----------

class EnvViewSet(viewsets.ModelViewSet):
    queryset = Env.objects.select_related("app")
    serializer_class = EnvSerializer
    permission_classes = [DefaultAllowAny]


# ---------- EnvVar ----------

class EnvVarViewSet(viewsets.ModelViewSet):
    queryset = EnvVar.objects.select_related("env", "env__app")
    serializer_class = EnvVarSerializer
    permission_classes = [DefaultAllowAny]


# ---------- Server ----------

class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [DefaultAllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        server = serializer.save()

        setup_cmd = set_server_conection(server)

        headers = self.get_success_headers(serializer.data)

        data = serializer.data.copy()
        data["setup_cmd"] = setup_cmd 

        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["get"])
    def status(self, request, pk=None):
        server = self.get_object()

        is_up = is_server_up(server)

        return Response({
            "id": server.id,
            "status": "on" if is_up else "off"
        })

    @action(detail=True, methods=["post"])
    def setup(self, request, pk=None):
        """
        Hace el setup del server:
        - Instala docker (vía hermes_set_server)
        - Crea docker-compose.yml con nginx-proxy + acme-companion
        - Ejecuta docker compose up -d
        """
        db_server: Server = self.get_object()

        if not db_server.ip:
            return Response(
                {"detail": "El server no tiene IP configurada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if db_server.email:
            user = db_server.email.split("@")[0]
            default_email = db_server.email
        else:
            user = "root"
            default_email = "root@example.com"

        h_server = HermesServer(
            server_name=db_server.name,
            user=user,
            project_id=db_server.project,
            vm_name=db_server.name,
            host_address=db_server.ip,
            ssh_key="",
            env=None,
            services=None,
            apps=None,
            events=None,
        )

        hermes_set_server(h_server)

        compose_content = f"""
services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    container_name: nginx-proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./nginx/certs:/etc/nginx/certs
      - ./nginx/vhost.d:/etc/nginx/vhost.d
      - ./nginx/html:/usr/share/nginx/html
      - ./nginx/conf.d:/etc/nginx/conf.d
    labels:
      com.github.nginx-proxy.nginx: "true"
    networks:
      - nginx-proxy-net

  nginx-proxy-acme:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-acme
    depends_on:
      - nginx-proxy
    restart: always
    environment:
      DEFAULT_EMAIL: {default_email}
      NGINX_PROXY_CONTAINER: nginx-proxy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./nginx/certs:/etc/nginx/certs
      - ./nginx/vhost.d:/etc/nginx/vhost.d
      - ./nginx/html:/usr/share/nginx/html
      - ./nginx/conf.d:/etc/nginx/conf.d
    networks:
      - nginx-proxy-net

networks:
  nginx-proxy-net:
    external: true
"""

        remote_cmds = [
            'mkdir -p ~/reverse-proxy/nginx/certs '
            '~/reverse-proxy/nginx/vhost.d '
            '~/reverse-proxy/nginx/html '
            '~/reverse-proxy/nginx/conf.d',

            'cd ~/reverse-proxy',

            f'cat > docker-compose.infra.yml << "EOF"\n{compose_content}\nEOF',

            'docker network inspect nginx-proxy-net >/dev/null 2>&1 || '
            'docker network create nginx-proxy-net',

            'docker compose -f docker-compose.infra.yml pull',
            'docker compose -f docker-compose.infra.yml up -d',
        ]

        # Ejecutamos los comandos en el server remoto
        run_serverside(h_server, remote_cmds)

        return Response(
            {
                "detail": "Setup del server iniciado. Se ha enviado el docker-compose del reverse proxy.",
                "server_id": db_server.id,
                "user": user,
                "email_usado": default_email,
            },
            status=status.HTTP_200_OK,
        )
