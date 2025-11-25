import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useApps } from "../../../features/deployments/apps/hooks";
import { useAppState } from "../../../context/AppStateContext";

export function AppsPage() {
  const { t } = useTranslation();
  const { setAdvancedForm } = useAppState();

  const {
    data: apps = [],
    isLoading,
    isError,
    error,
  } = useApps();

  console.log("Apps fetched:", apps);

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

  const locationsCell = {
    key: "locations",
    header: t("servers"),
    sortable: false,
    cell: (row) => (
      <div className="full-w flex-center">
        {(row.locations || [])
          .map((loc) => `${loc.ip}:${loc.port}`)
          .join(", ")}
      </div>
    ),
    width: "35%",
  };

  return (
    <div className="full-view flex column-left gap20">
      <TableCRUD
        id="apps"
        table_name="apps"
        addFormName="addApp"
        searchKeys={["name", "servers", "domain", "repository", "image"]}
        columns={[
          statusCell,
          { key: "name", header: t("name"), sortable: true, width: "20%" },
          { key: "domain", header: t("domain"), sortable: true, width: "25%" },
          locationsCell,
          { key: "image", header: t("image"), sortable: true, width: "20%" },
        ]}
        initialData={apps}
        buttonName="create"
        // 👇 abre FormActionsApp
        onRowClick={(row) => setAdvancedForm("actionsApp", row)}
      />
    </div>
  );
}

export default AppsPage;
