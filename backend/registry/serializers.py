# deploy/serializers.py
from rest_framework import serializers
from .models import App, Image, Repo, EnvVar, Server, AppLocation


class EnvVarSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvVar
        # En el front EnvVarModel solo tiene id, name, value
        fields = ["id", "name", "value"]


class RepoSerializer(serializers.ModelSerializer):
    # repo.envVars en el front
    envVars = EnvVarSerializer(many=True, source="env_vars", required=False)

    class Meta:
        model = Repo
        fields = ["id", "name", "url", "envVars"]

    def create(self, validated_data):
        envvars_data = validated_data.pop("env_vars", [])
        repo = Repo.objects.create(**validated_data)
        for ev in envvars_data:
            EnvVar.objects.create(repo=repo, **ev)
        return repo

    def update(self, instance, validated_data):
        envvars_data = validated_data.pop("env_vars", None)

        # Campos simples
        instance.name = validated_data.get("name", instance.name)
        instance.url = validated_data.get("url", instance.url)
        instance.save()

        # Manejo de envVars anidados (simple: reemplazar todos)
        if envvars_data is not None:
            instance.env_vars.all().delete()
            for ev in envvars_data:
                EnvVar.objects.create(repo=instance, **ev)

        return instance


class ImageSerializer(serializers.ModelSerializer):
    # repository puede ser null o id
    repository = serializers.PrimaryKeyRelatedField(
        queryset=Repo.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Image
        fields = ["id", "name", "url", "repository", "branch", "version"]


class ServerSerializer(serializers.ModelSerializer):
    # user = id de User (opcional)
    # user = serializers.PrimaryKeyRelatedField(
    #     queryset=Server._meta.get_field("user").remote_field.model.objects.all(),
    #     required=False,
    #     allow_null=True,
    # )

    class Meta:
        model = Server
        fields = ["id", "name", "ip", "email", "region", "project"]


# deploy/serializers.py

class AppLocationSerializer(serializers.ModelSerializer):
    # Para escribir: mandas el id del server (server)
    server = serializers.PrimaryKeyRelatedField(
        queryset=Server.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,      
    )
    ip = serializers.CharField(source="server.ip", read_only=True)

    class Meta:
        model = AppLocation
        fields = ["id", "server", "ip", "port"]


class AppSerializer(serializers.ModelSerializer):
    image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.all(),
        required=False,
        allow_null=True,
    )
    # locations: lista de AppLocationModel
    locations = AppLocationSerializer(many=True, required=False)

    class Meta:
        model = App
        fields = ["id", "name", "domain", "locations", "image"]

    def create(self, validated_data):
        locations_data = validated_data.pop("locations", [])
        app = App.objects.create(**validated_data)

        for loc in locations_data:
            AppLocation.objects.create(app=app, **loc)

        return app

    def update(self, instance, validated_data):
        locations_data = validated_data.pop("locations", None)

        instance.name = validated_data.get("name", instance.name)
        instance.domain = validated_data.get("domain", instance.domain)
        instance.image = validated_data.get("image", instance.image)
        instance.save()

        # Si viene "locations", hacemos un replace simple
        if locations_data is not None:
            instance.locations.all().delete()
            for loc in locations_data:
                AppLocation.objects.create(app=instance, **loc)

        return instance
