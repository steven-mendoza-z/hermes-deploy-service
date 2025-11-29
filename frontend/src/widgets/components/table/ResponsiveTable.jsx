// src/widgets/components/ResponsiveTable.jsx
import { useState, useEffect } from "react";
import TableCRUD from "./TableCRUD";
import FloatingRowMenu from "./FloatingRowMenu";
import { useAppState } from "../../../context/AppStateContext";

export default function ResponsiveTable({
  id,
  table_name,
  addFormName,
  searchKeys,
  columns,
  initialData = [],
  buttonName = "add",

  mobileAction,
  desktopOnClick,          // 👈 NEW
  desktopMenuTitle,
  desktopMenuActions = [],
}) {
  const { isMobile } = useAppState();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

  const closeMenu = () =>
    setContextMenu({ visible: false, x: 0, y: 0, row: null });

  // If the table reloads, close the menu
  useEffect(() => {
    closeMenu();
  }, [initialData]);

  const handleRowClick = (row) => {
    if (isMobile) {
      if (mobileAction) mobileAction(row);
      return;
    }

    // desktop click
    if (desktopOnClick) desktopOnClick(row);   // 👈 NEW

    // if menu is open and user selects another row → close it
    if (contextMenu.visible && contextMenu.row?.id !== row.id) {
      closeMenu();
    }
  };

  const handleSelectedClick = (row, event) => {
    if (isMobile) return;

    // toggle open/close on same row
    if (contextMenu.visible && contextMenu.row?.id === row.id) {
      return closeMenu();
    }

    // close menu if clicking a different selected row
    if (contextMenu.visible && contextMenu.row?.id !== row.id) {
      return closeMenu();
    }

    // open new menu for this row
    const x = Math.min(event.clientX, window.innerWidth - 240);
    const y = Math.min(event.clientY, window.innerHeight - 200);

    setContextMenu({
      visible: true,
      x,
      y,
      row,
    });
  };

  return (
    <div className="full-view column-left" style={{ position: "relative" }}>
      <TableCRUD
        id={id}
        table_name={table_name}
        addFormName={addFormName}
        searchKeys={searchKeys}
        columns={columns}
        initialData={initialData}
        buttonName={buttonName}
        onRowClick={handleRowClick}
        onSelectedClick={handleSelectedClick}
        onDeselect={closeMenu}
      />

      {!isMobile &&
        contextMenu.visible &&
        contextMenu.row &&
        desktopMenuActions.length > 0 && (
          <FloatingRowMenu
            x={contextMenu.x}
            y={contextMenu.y}
            title={desktopMenuTitle}
            row={contextMenu.row}
            actions={desktopMenuActions}
            onClose={closeMenu}
          />
        )}
    </div>
  );
}
