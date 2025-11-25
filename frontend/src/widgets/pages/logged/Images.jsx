import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useImages } from "../../../features/deployments/images/hooks";
import { useAppState } from "../../../context/AppStateContext";

export function ImagesPage() {
  const { t } = useTranslation();
  const { setAdvancedForm } = useAppState();

  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useImages();

  console.log("Images fetched:", images);

  return (
    <div className="full-view flex column-left gap20">
      <TableCRUD
        id="images"
        table_name="images"
        addFormName="addImage"
        searchKeys={["name", "url", "app"]}
        columns={[
          { key: "name", header: t("name"), sortable: true, width: "25%" },
          { key: "version", header: t("version"), sortable: true, width: "10%" },
          { key: "url", header: t("url"), sortable: true, width: "40%" },
          { key: "repository", header: t("source"), sortable: true, width: "25%" },
        ]}
        initialData={images}
        // 👇 abre FormActionsImage
        onRowClick={(row) => setAdvancedForm("actionsImage", row)}
      />
    </div>
  );
}

export default ImagesPage;
