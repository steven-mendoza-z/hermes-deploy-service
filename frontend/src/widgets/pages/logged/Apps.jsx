// src/widgets/pages/logged/Apps.jsx
import { useTranslation } from "react-i18next";
import { useApps, useDeleteApp } from "../../../features/deployments/apps/hooks";
// import AppStatusCell from "../../components/table/AppStatusCell";
import { useAppState } from "../../../context/AppStateContext";
import ResponsiveTable from "../../components/table/ResponsiveTable";

export function AppsPage() {
  const { t } = useTranslation();
  const { setAdvancedForm, setFormObject } = useAppState();

  const {
    data: apps = [],
    // isLoading,
    // isError,
    // error,
  } = useApps();

  const deleteApp = useDeleteApp();

  // const statusCell = {
  //   key: "status",
  //   header: "",
  //   sortable: false,
  //   cell: (row) => (
  //     <div className="full-w flex-center">
  //       <div
  //         className={`center server-status ${
  //           row.status === "on" ? "on" : "off"
  //         }`}
  //       ></div>
  //     </div>
  //   ),
  //   cell: (row) => <AppStatusCell id={row.id} />,
  //   width: "50px",
  // };

  const sourceCell = {
    key: "source",
    header: t("source"),
    sortable: false,
    cell: (row) => (
     (row.repoName || row.repo ? <div className="full-w flex-center">
        {row.repoName || row.repo} {row.branch && `(${row.branch})`}
      </div> : (
        <img src="tables/line.svg" alt="null" className="table-null icon"/>
      )
    )),
    width: "25%",
  };

  const columns = [
    // statusCell,
    {
      key: "name",
      header: t("name"),
      sortable: true,
      width: "25%",
    },
    {
      key: "domain",
      header: t("domain"),
      sortable: true,
      width: "25%",
    },
    sourceCell,
    {
      key: "serverName",
      header: t("destination"),
      sortable: true,
      width: "25%",
    },
    // locationsCell,

    // {
    //   key: "repoName",
    //   header: t("repository"),
    //   sortable: true,
    //   width: "30%",
    // },
    // {
    //   key: "branch",
    //   header: t("branch"),
    //   sortable: true,
    //   width: "20%",
    // },
  ];

  const desktopMenuActions = [
    {
      label: t("deploy"),
      onClick: (row) => {
        setAdvancedForm("");
      },
    },
    {
      label: t("envVars"),
      onClick: (row) => {
        setFormObject(row);
        setAdvancedForm("editEnv", row);
      },
    },
    {
      label: t("edit"),
      onClick: (row) => {
        setFormObject(row);
        setAdvancedForm("editApp", row);
      },
    },
    {
      label: t("delete"),
      onClick: (row) => {
        if (!row?.id) return;
        deleteApp.mutate(
          { pathParams: { id: row.id } },
          {
            onError: (err) => {
              console.error("Error deleting app:", err);
            },
          }
        );
      },
    },
  ];

  return (
    <ResponsiveTable
      id="apps"
      table_name="apps"
      addFormName="addApp"
      searchKeys={["name", "servers", "domain", "repo_name", "image", "server"]}
      columns={columns}
      initialData={apps}
      buttonName="create"
      // mobile: abre directamente el form de acciones
      mobileAction={(row) => {
        setFormObject(row);
        setAdvancedForm("actionsApp", row);
      }}
      // desktop: menú flotante
      desktopMenuTitle={t("app")}
      desktopMenuActions={desktopMenuActions}
    />
  );
}

export default AppsPage;
