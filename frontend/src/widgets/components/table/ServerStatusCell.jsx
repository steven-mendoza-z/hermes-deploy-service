import { useEffect, useState } from "react";
import { getServerStatus } from "../../../features/deployments/servers/hooks";

function ServerStatusCell({ id }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getServerStatus(id);
        if (!cancelled) {
          setStatus(data.status || "off");
        }
      } catch (err) {
        console.error("Error cargando status del server", id, err);
        if (!cancelled) setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  let className = "loading";
  if (status === "on") className = "on";
  else if (status === "off") className = "off";
  else if (status === "error") className = "error";

  return (
    <div className="full-w flex-center">
      <div className={`center server-status ${className}`} />
    </div>
  );
}

export default ServerStatusCell;
