# deploy/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AppViewSet,
    ImageViewSet,
    RepoViewSet,
    ServerViewSet,
    EnvViewSet,
    EnvVarViewSet,
)

router = DefaultRouter()
router.register(r"apps", AppViewSet, basename="app")
router.register(r"images", ImageViewSet, basename="image")
router.register(r"repos", RepoViewSet, basename="repo")
router.register(r"servers", ServerViewSet, basename="server")
router.register(r"envs", EnvViewSet, basename="env")
router.register(r"env-vars", EnvVarViewSet, basename="envvar")

urlpatterns = [
    path("", include(router.urls)),
]
