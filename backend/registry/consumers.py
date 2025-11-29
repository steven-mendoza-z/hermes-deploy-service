import threading
import time
import paramiko

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async

from registry.models import Server as DbServer
from hermes.services.connect import sshKey_path


class SSHConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.server_id = self.scope["url_route"]["kwargs"]["server_id"]
        self.ssh_client = None
        self.ssh_channel = None

        await self.accept()
        await self.send(text_data="[system] Initializing SSH connection...\r\n")

        # Get server from DB
        try:
            server = await self._get_server()
        except DbServer.DoesNotExist:
            await self.send(text_data="[error] Server not found.\r\n")
            await self.close()
            return

        server_name = server.name or f"server-{server.pk}"
        host = server.ip
        user = self._get_ssh_user(server)
        key_path = sshKey_path(server_name)

        await self.send(
            text_data=f"[system] Connecting to {server_name} as {user}@{host}...\r\n"
        )

        try:
            self._open_ssh(host, user, key_path)
        except Exception as e:
            await self.send(
                text_data="[error] Failed to establish SSH connection.\r\n"
            )
            await self.close()
            return

        await self.send(text_data="[system] SSH session established.\r\n")

    async def receive(self, text_data=None, bytes_data=None):
        if text_data is not None and self.ssh_channel is not None:
            self.ssh_channel.send(text_data)

    async def disconnect(self, close_code):
        if self.ssh_channel:
            try:
                self.ssh_channel.close()
            except Exception:
                pass

        if self.ssh_client:
            try:
                self.ssh_client.close()
            except Exception:
                pass

    @database_sync_to_async
    def _get_server(self) -> DbServer:
        return DbServer.objects.get(pk=self.server_id)

    def _get_ssh_user(self, server: DbServer) -> str:
        if server.email:
            return server.email.split("@")[0]
        return "root"

    def _open_ssh(self, host: str, user: str, key_path: str):
        self.ssh_client = paramiko.SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        pkey = paramiko.RSAKey.from_private_key_file(key_path)

        self.ssh_client.connect(
            hostname=host,
            username=user,
            pkey=pkey,
            look_for_keys=False,
            allow_agent=False,
            timeout=10,
            banner_timeout=10,
        )

        self.ssh_channel = self.ssh_client.invoke_shell(term="xterm")

        def reader():
            buffer = ""
            try:
                while True:
                    if self.ssh_channel.recv_ready():
                        data = self.ssh_channel.recv(8192)
                        if not data:
                            break

                        buffer += data.decode(errors="ignore")

                        if len(buffer) >= 1024:
                            async_to_sync(self.send)(text_data=buffer)
                            buffer = ""
                    else:
                        if buffer:
                            async_to_sync(self.send)(text_data=buffer)
                            buffer = ""
                        time.sleep(0.01)

            except Exception:
                pass

            finally:
                try:
                    if buffer:
                        async_to_sync(self.send)(text_data=buffer)
                except Exception:
                    pass
                try:
                    self.ssh_channel.close()
                except Exception:
                    pass
                try:
                    self.ssh_client.close()
                except Exception:
                    pass

        t = threading.Thread(target=reader, daemon=True)
        t.start()
