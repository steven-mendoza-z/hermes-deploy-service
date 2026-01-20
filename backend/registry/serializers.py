# deploy/serializers.py
from rest_framework import serializers
from .models import App, Image, Repo, Env, EnvVar, Server


# ---------- Env / EnvVar ----------

class EnvVarSerializer(serializers.ModelSerializer):
    # write_only: se puede enviar, pero nunca se devuelve (GitHub Secrets style)
    value = serializers.CharField(write_only=True)

    class Meta:
        model = EnvVar
        fields = ["id", "env", "name", "value"]


class EnvSerializer(serializers.ModelSerializer):
    app = serializers.PrimaryKeyRelatedField(queryset=App.objects.all())

    class Meta:
        model = Env
        fields = ["id", "app", "name"]


# ---------- Repo ----------

class RepoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repo
        fields = ["id", "name", "url"]


# ---------- Image ----------

class ImageSerializer(serializers.ModelSerializer):
    # repository puede ser null o id
    repository = serializers.PrimaryKeyRelatedField(
        queryset=Repo.objects.all(),
        required=False,
        allow_null=True,
    )
    repository_name = serializers.CharField(source="repository.name", read_only=True)

    class Meta:
        model = Image
        fields = ["id", "name", "url", "repository", "repository_name", "branch", "version"]


# ---------- Server ----------

class ServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        fields = ["id", "name", "ip", "email", "region", "project"]


# ---------- App ----------

class AppSerializer(serializers.ModelSerializer):
    # repo: id de Repo
    repo = serializers.PrimaryKeyRelatedField(
        queryset=Repo.objects.all(),
        required=False,
        allow_null=True,
    )
    repo_name = serializers.CharField(source="repo.name", read_only=True)

    # server: id de Server
    server = serializers.PrimaryKeyRelatedField(
        queryset=Server.objects.all(),
        required=False,
        allow_null=True,
    )
    server_name = serializers.CharField(source="server.name", read_only=True)
    server_ip = serializers.CharField(source="server.ip", read_only=True)

    class Meta:
        model = App
        fields = [
            "id",
            "name",
            "domain",
            "repo",
            "repo_name",
            "branch",
            "server",
            "server_name",
            "server_ip",
        ]

    def create(self, validated_data):
        # Crear la App
        app = App.objects.create(**validated_data)
        # 🔥 Crear Env por defecto .env para esta App
        Env.objects.create(app=app, name=".env")
        return app

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.domain = validated_data.get("domain", instance.domain)
        instance.repo = validated_data.get("repo", instance.repo)
        instance.branch = validated_data.get("branch", instance.branch)
        instance.server = validated_data.get("server", instance.server)
        instance.save()

        # 🔒 Garantizar que siempre exista un Env (.env) asociado
        if not instance.envs.exists():
          Env.objects.create(app=instance, name=".env")

        return instance
