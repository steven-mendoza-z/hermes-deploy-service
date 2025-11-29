// src/widgets/pages/logged/Servers.jsx
import { useTranslation } from "react-i18next";
import {
  getServerStatus,
  useDeleteServer,
  useServers,
} from "../../../features/deployments/servers/hooks";
import { useAppState } from "../../../context/AppStateContext";
import { useState } from "react";
import ResponsiveTable from "../../components/table/ResponsiveTable";
import ServerStatusCell from "../../components/table/ServerStatusCell";

/**
 * Eye icon per row:
 * - Single click: toggle hiddenRows[row.id]
 * - Double click: stopPropagation so it doesn't trigger row double-click / selected click
 */
function ToggleIcon({ row, hiddenRows, setHiddenRows }) {
  const active = hiddenRows[row.id]; // true = extra data visible

  const handleClick = (e) => {
    e.stopPropagation();
    setHiddenRows((prev) => ({
      ...prev,
      [row.id]: !prev[row.id],
    }));
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="see-button-container"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={active ? "/eye.svg" : "/eye-slash.svg"}
        alt="toggle"
        className="see-button icon"
      />
    </div>
  );
}

/**
 * Column definition factory:
 * - Respects isMobile layout
 * - Uses hiddenRows to hide ip/region/project when needed
 */
function getColumns(isMobile, t, hiddenRows, setHiddenRows) {
  const isHidden = (row) => !hiddenRows[row.id];

  const statusCell = {
    key: "status",
    header: "",
    sortable: false,
    cell: (row) => <ServerStatusCell id={row.id} />,
    width: "50px",
  };

  const toggleCell = {
    key: "toggle",
    header: "",
    sortable: false,
    width: "5px",
    cell: (row) => (
      <ToggleIcon
        row={row}
        hiddenRows={hiddenRows}
        setHiddenRows={setHiddenRows}
      />
    ),
  };

  const common = [
    statusCell,
    {
      key: "name",
      header: t("name"),
      sortable: true,
      width: isMobile ? "25%" : "20%",
    },
    {
      key: "ip",
      header: t("ipAddress"),
      sortable: true,
      width: "20%",
      accessor: (row) => (isHidden(row) ? "" : row.ip),
    },
    {
      key: "region",
      header: t("region"),
      sortable: true,
      width: "20%",
      accessor: (row) => (isHidden(row) ? "" : row.region),
    },
    {
      key: "email",
      header: t("email"),
      sortable: true,
      width: isMobile ? "35%" : "20%",
    },
    {
      key: "project",
      header: t("projectId"),
      sortable: true,
      width: "15%",
      accessor: (row) => (isHidden(row) ? "" : row.project),
    },
    toggleCell,
  ];

  // On mobile we hide "project" column
  return isMobile ? common.filter((c) => c.key !== "project") : common;
}

export function ServersPage() {
  const { t } = useTranslation();
  const { isMobile, setAdvancedForm, setSelectedServer } = useAppState();
  const { data: servers = [] } = useServers();
  const deleteServer = useDeleteServer();

  const [hiddenRows, setHiddenRows] = useState({});

  const columns = getColumns(isMobile, t, hiddenRows, setHiddenRows);

  const desktopMenuActions = [
    {
      label: t("edit"),
      onClick: (row) => {
        setSelectedServer(row);
        setAdvancedForm("actionsServer", row);
      },
    },
    {
      label: t("delete"),
      onClick: (row) => {
        if (!row?.id) return;
        deleteServer.mutate(
          { pathParams: { id: row.id } },
          {
            onError: (err) => {
              console.error("Delete server failed:", err);
            },
          }
        );
      },
    },
  ];

  return (
    <ResponsiveTable
      id="servers"
      table_name="servers"
      addFormName="addServer"
      searchKeys={["name", "ip", "email", "region", "project"]}
      columns={columns}
      initialData={servers}
      // mobile: abrir directamente el form de acciones
      mobileAction={(row) => {
        setSelectedServer(row);
        setAdvancedForm("actionsServer", row);
      }}
      // desktop: menú flotante con estas acciones
      desktopOnClick={(row) => {
        setSelectedServer(row);
      }}
      desktopMenuTitle="server"
      desktopMenuActions={desktopMenuActions}
    />
  );
}

export default ServersPage;
