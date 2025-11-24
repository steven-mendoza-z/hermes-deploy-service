// Shell.jsx
import { useEffect, useRef, forwardRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

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

export function useXterm(containerRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (!containerRef?.current) return;

    const terminal = new Terminal({
      fontSize: 13,
      fontWeight: 500,
      theme: {
        background: "#0000",
        foreground: "#999",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();

    terminal.write("Connecting to server...\r\n");

    const observer = new MutationObserver(() => {
      terminal.setOption("theme", {
        background: "#0000",
        foreground: "#aaa",
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      terminal.dispose();
      observer.disconnect();
    };
  }, [containerRef, enabled]);
}

export default function Shell({ name }) {
  const [open, setOpen] = useState(false);
  const container = useRef(null);

  useXterm(container, open);

  return (
    <div className={`shell ${open ? "open" : "closed"}`}>
      <div
        className="shell-header row gap20"
        onClick={() => setOpen(o => !o)}
      >
        <p className="h5 full-w">Terminal (Server{name})</p>
        <img
          src={open ? "arrow-down.png" : "arrow-up.png"}
          alt="arrow"
          className="icon"
        />
      </div>

      <div className="shell-content">
        <TerminalContainer ref={container} />
      </div>
    </div>
  );
}
