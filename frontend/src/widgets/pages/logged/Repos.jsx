import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useRepos } from "../../../features/deployments/repos/hooks";
import { useAppState } from "../../../context/AppStateContext";

export function RepositoriesPage() {
  const { t } = useTranslation();
  const { setAdvancedForm } = useAppState();

  const {
    data: repos = [],
    isLoading,
    isError,
    error,
  } = useRepos();

  console.log("Repos fetched:", repos);

  return (
    <div className="full-view flex column-left gap20">
      <TableCRUD
        id="repositories"
        table_name="repositories"
        addFormName="addRepository"
        searchKeys={["name", "url", "branch", "app"]}
        columns={[
          { key: "name", header: t("name"), sortable: true, width: "25%" },
          { key: "url", header: t("url"), sortable: true, width: "40%" },
        ]}
        initialData={repos}
        // 👇 abre FormActionsRepo
        onRowClick={(row) => setAdvancedForm("actionsRepo", row)}
      />
    </div>
  );
}

export default RepositoriesPage;
