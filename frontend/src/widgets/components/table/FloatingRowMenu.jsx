// src/widgets/components/FloatingRowMenu.jsx
import React from "react";

export default function FloatingRowMenu({
  x,
  y,
  row,
  title,
  actions = [],
  onClose,
}) {
  if (!row) return null;

  const handleContainerClick = (e) => {
    // evita que el click dentro del menú burbujee al window
    e.stopPropagation();
  };

  return (
    <div
      className="floating-row-menu"
      onClick={handleContainerClick}
      style={{
        position: "fixed",
        top: y + 4,
        left: x + 4,
        zIndex: 99,
      }}
    >
      <div className="floating-row-menu-card">
        <div className="title-container">
          <p className="t-body1 title">{row.name}</p>
          {title && <p className="h5">{title}</p>}
        </div>

        {actions.map(({ label, icon, onClick, color }, idx) => (
          <button
            key={label || idx}
            className={`menu-item ${color || ""}`}
            onClick={() => {
              onClick?.(row);
              onClose?.();
            }}
          >
            {icon && (
              <img
                src={icon}
                alt={label}
                className="icon"
                style={{ marginRight: 8 }}
              />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
