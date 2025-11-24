import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useServers } from "../../../features/deployments/servers/hooks";
import { useAppState } from "../../../context/AppStateContext";

export function ServersPage() {
  const { t } = useTranslation();
  const { isMobile } = useAppState();

  const {
    data: servers = [],   // <- aquí viene el array de ServerModel (o lo que devuelva mapOne)
    isLoading,
    isError,
    error,
  } = useServers();
  console.log("fetched:", servers);

  // const servers = [
  //   { name: "host-server", email: "server1@example.com", region: "us-central1-a", ip: "192.168.1.1", status: "on", user: "User 1" },
  //   { name: "smooth-server", email: "server2@example.com", region: "us-central1-a", ip: "192.168.1.2", status: "off", user: "User 2" },
  // ];
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(servers);
  }, [!isLoading]);

  const statusCell = {
    key: "status",
    header: "",
    sortable: false,
    cell: (row) => (
      <div className="full-w flex-center">
        <div className={`center server-status ${row.status === "on" ? "on" : "off"}`}></div>
      </div>
    ),
    width: "50px",
  };

  // Provider
  return (
    <div className="full-view flex column-left gap20">
      <TableCRUD
        id="servers"
        table_name="servers"
        addFormName="addServer"
        searchKeys={["name", "ip", "email", "region", "project"]}
        columns={
          isMobile ? 
          [
            statusCell,
            { key: "name", header: t("name"), sortable: true, width: "25%" },
            { key: "ip", header: t("ipAddress"), sortable: true, width: "20%" },
            { key: "region", header: t("region"), sortable: true, width: "20%" },
            { key: "email", header: t("email"), sortable: true, width: "35%" },
          ]     
          : 
          [
            statusCell,
            { key: "name", header: t("name"), sortable: true, width: "20%" },
            { key: "ip", header: t("ipAddress"), sortable: true, width: "20%" },
            { key: "region", header: t("region"), sortable: true, width: "20%" },
            { key: "email", header: t("email"), sortable: true, width: "20%" },
            { key: "project", header: t("projectId"), sortable: true, width: "20%" },
          ]     

        }
        data={data}
        setData={setData}
      />
    </div>
  );
}

export default ServersPage;
