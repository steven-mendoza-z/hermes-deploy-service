# deploy/models.py
from django.conf import settings
from django.db import models


class Server(models.Model):
    # user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="servers",
    # )
    name = models.CharField(max_length=255, blank=True)
    ip = models.CharField(max_length=63, blank=True)
    email = models.EmailField(blank=True)
    region = models.CharField(max_length=100, blank=True)
    project = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name or self.email or f"Server {self.pk}"


class Repo(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return self.name


class EnvVar(models.Model):
    repo = models.ForeignKey(
        Repo,
        on_delete=models.CASCADE,
        related_name="env_vars",
    )
    name = models.CharField(max_length=255)
    value = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.repo.name})"


class Image(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    repository = models.ForeignKey(
        Repo,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="images",
    )
    branch = models.CharField(max_length=255, blank=True)
    version = models.CharField(max_length=63, blank=True)

    def __str__(self):
        return self.name


class App(models.Model):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, blank=True)
    image = models.ForeignKey(
        Image,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="apps",
    )

    def __str__(self):
        return self.name or self.domain or f"App {self.pk}"


class AppLocation(models.Model):
    app = models.ForeignKey(
        App,
        on_delete=models.CASCADE,
        related_name="locations",
    )
    server = models.ForeignKey(
        Server,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="app_locations",
    )
    port = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.app} @ {self.server} : {self.port}"
