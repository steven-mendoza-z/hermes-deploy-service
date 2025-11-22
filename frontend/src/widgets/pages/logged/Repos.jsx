import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useRepos } from "../../../features/deployments/repos/hooks";

export function RepositoriesPage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  // const repositories = [
  //   { name: "Repo 1", url: "https://github.com/user/repo1" },
  // ];

  const {
    data: repos = [], 
    isLoading,
    isError,
    error,
  } = useRepos();
  console.log("fetched:", repos);

  useEffect(() => {
    setData(repos);
  }, [!isLoading]);


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
        data={data}
        setData={setData}
      />
    </div>
  );
}

export default RepositoriesPage;
