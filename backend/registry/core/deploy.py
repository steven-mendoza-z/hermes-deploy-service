import subprocess

from hermes.core.models import Server as HermesServer
from hermes.core.models import App as HermesApp
from hermes.services.deploy import deploy_app
from hermes.internal.app import pull_app
from hermes.internal.keys import remote_access_cmd

# build env
# deploy repo
# deploy image

def deploy_app_fromRepo1(name:str, domain:str, repo_name:str, repo_url:str, branch:str):
    pass

def deploy_app_fromRepo(server:HermesServer, app:HermesApp):
    pull_app(server, app)
    cmds = [f"cd {app.name}"]
    subprocess.run(remote_access_cmd() + [docker_cmd], shell=False)
    

