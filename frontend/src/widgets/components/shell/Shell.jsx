// Shell.jsx
import { useEffect, useRef, forwardRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useAppState } from "../../../context/AppStateContext";
import { useTranslation } from "react-i18next";

const TerminalContainer = forwardRef(function TerminalContainer(_, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#0000",
        fontSize: "6px",
      }}
    />
  );
});

/**
 * Hook that:
 * - Creates the xterm instance
 * - Opens the WebSocket to Django Channels
 * - Connects xterm <-> WebSocket <-> SSH
 *
 * Backend only needs serverId in the URL.
 */
export function useXterm(containerRef, { enabled, serverId, serverName }) {
  useEffect(() => {
    if (!enabled) return;
    if (!containerRef?.current) return;
    if (!serverId) return;

    const terminal = new Terminal({
      fontSize: 13,
      fontWeight: 500,
      cursorBlink: true,
      scrollback: 1000,
      theme: {
        background: "#0000",
        foreground: "#999",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();

    // Frontend system message
    terminal.write(
      `[system] Opening local terminal for ${serverName}...\r\n`
    );

    // Resize handling
    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch {}
    };
    window.addEventListener("resize", handleResize);

    const wsUrl = `ws://localhost:8000/ws/shell/${serverId}/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      terminal.write(
        "[system] WebSocket connected. Waiting for SSH session...\r\n"
      );
    };

    socket.onmessage = (event) => {
      // Backend sends plain text with [system]/[error] prefixes
      terminal.write(event.data);
    };

    socket.onerror = () => {
      terminal.write("\r\n[error] WebSocket error.\r\n");
    };

    socket.onclose = () => {
      terminal.write("\r\n[system] WebSocket closed.\r\n");
    };

    const onData = (data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    };
    const disposable = terminal.onData(onData);

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        disposable.dispose();
      } catch {}
      try {
        terminal.dispose();
      } catch {}
      try {
        socket.close();
      } catch {}
    };
  }, [containerRef, enabled, serverId, serverName]);
}


export default function Shell() {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const { selectedServer } = useAppState();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useXterm(container, {
    enabled: !!selectedServer,             // 👈 conexión ligada al server, no al panel
    serverId: selectedServer?.id,
    serverName: selectedServer?.name,
  });

  return (
    <div className={`shell ${open ? "open" : "closed"}`}>
      <div
        className="shell-header row gap20"
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: "pointer" }}
      >
        <p className="h5 full-w">
          Terminal {selectedServer?.name && `(${selectedServer.name})`}
        </p>
        <img
          src={open ? "arrow-down.png" : "arrow-up.png"}
          alt="toggle terminal"
          className="icon"
        />
      </div>

      <div className={`shell-content ${open ? "open" : "closed"}`}>
        {selectedServer ? (
          <TerminalContainer ref={container} />
        ) : (
          <div className="full-w flex-center" style={{ padding: "8px" }}>
            <p className="h6">
              {t("selectServerMessage")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

