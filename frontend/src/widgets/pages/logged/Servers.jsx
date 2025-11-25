import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useServers } from "../../../features/deployments/servers/hooks";
import { useAppState } from "../../../context/AppStateContext";

export function ServersPage() {
  const { t } = useTranslation();
  const { isMobile, setAdvancedForm } = useAppState();
  const { data: servers = [] } = useServers();

  const statusCell = {
    key: "status",
    header: "",
    sortable: false,
    cell: (row) => (
      <div className="full-w flex-center">
        <div
          className={`center server-status ${
            row.status === "on" ? "on" : "off"
          }`}
        ></div>
      </div>
    ),
    width: "50px",
  };

  return (
    <div className="full-view flex column-left gap20">
      <TableCRUD
        id="servers"
        table_name="servers"
        addFormName="addServer"
        searchKeys={["name", "ip", "email", "region", "project"]}
        columns={
          isMobile
            ? [
                statusCell,
                { key: "name", header: t("name"), sortable: true, width: "25%" },
                { key: "ip", header: t("ipAddress"), sortable: true, width: "20%" },
                { key: "region", header: t("region"), sortable: true, width: "20%" },
                { key: "email", header: t("email"), sortable: true, width: "35%" },
              ]
            : [
                statusCell,
                { key: "name", header: t("name"), sortable: true, width: "20%" },
                { key: "ip", header: t("ipAddress"), sortable: true, width: "20%" },
                { key: "region", header: t("region"), sortable: true, width: "20%" },
                { key: "email", header: t("email"), sortable: true, width: "20%" },
                { key: "project", header: t("projectId"), sortable: true, width: "20%" },
              ]
        }
        /** 👇 solo pasas la data original del backend */
        initialData={servers}
        onRowClick={(row) => setAdvancedForm("actionsServer", row)}
      />
    </div>
  );
}

export default ServersPage;
