// src/widgets/pages/logged/Repos.jsx
import { useTranslation } from "react-i18next";
import { useRepos, useDeleteRepo } from "../../../features/deployments/repos/hooks";
import { useAppState } from "../../../context/AppStateContext";
import ResponsiveTable from "../../components/table/ResponsiveTable";

export function ReposPage() {
  const { t } = useTranslation();
  const { setAdvancedForm, setFormObject } = useAppState();
  const { data: repos = [] } = useRepos();
  const deleteRepo = useDeleteRepo();

  const columns = [
    {
      key: "name",
      header: t("name"),
      sortable: true,
      width: "30%",
    },
    {
      key: "url",
      header: t("url"),
      sortable: true,
      width: "40%",
    }
  ];

  const desktopMenuActions = [
    {
      label: t("edit"),
      // icon: "edit.png",
      // color: "",
      onClick: (row) => {
        setFormObject(row);
        setAdvancedForm("editRepo", row);
      },
    },
    {
      label: t("delete"),
      // icon: "delete2.png",
      // color: "danger",
      onClick: (row) => {
        if (!row?.id) return;
        deleteRepo.mutate(
          { pathParams: { id: row.id } },
        );
      },
    },
  ];

  return (
    <ResponsiveTable
      id="repos"
      table_name="repositories"
      addFormName="addRepo"
      searchKeys={["name", "url", "branch"]}
      columns={columns}
      initialData={repos}
      // mobile: abrir directamente el form de acciones
      mobileAction={(row) => {
        setFormObject(row);
        setAdvancedForm("actionsRepo", row);
      }}
      // desktop: usar menú flotante con estas acciones
      desktopMenuTitle={t("repository")}
      desktopMenuActions={desktopMenuActions}
    />
  );
}

export default ReposPage;
