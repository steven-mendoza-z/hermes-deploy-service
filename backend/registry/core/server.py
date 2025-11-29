from hermes.core.models import Server as HermesServer
from hermes.internal.setup import set_client, set_server
from hermes.internal.funcs import run_serverside
from hermes.services.connect import set_connection, access_server
import socket
import subprocess
from registry.models import Server as DbServer

def set_server_conection(db_server: DbServer):
    if db_server.email:
        user = db_server.email.split("@")[0]
    else:
        user = "root"
    
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
        events=None
    )
    set_client()
    set_server(h_server)
    set_connection(h_server.vm_name, h_server, db_server.region)
    # reverse-proxy deploy



def is_server_up(db_server: DbServer, timeout: float = 2.0) -> bool:
    """
    Verifica si el servidor está encendido intentando abrir una conexión
    TCP al puerto SSH (22). Si responde, está activo.
    """
    ip = db_server.ip
    port = 22

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)

    try:
        result = sock.connect_ex((ip, port))
        return result == 0   # 0 = conectado
    except Exception:
        return False
    finally:
        sock.close()
