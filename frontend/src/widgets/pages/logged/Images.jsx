// src/widgets/pages/logged/Images.jsx
import { useTranslation } from "react-i18next";
import {
  useImages,
  useDeleteImage,
} from "../../../features/deployments/images/hooks";
import { useAppState } from "../../../context/AppStateContext";
import ResponsiveTable from "../../components/table/ResponsiveTable";

export function ImagesPage() {
  const { t } = useTranslation();
  const { setAdvancedForm, setFormObject } = useAppState();

  const {
    data: images = [],
    // isLoading,
    // isError,
    // error,
  } = useImages();

  const deleteImage = useDeleteImage();

  const sourceCell = {
    key: "source",
    header: t("source"),
    sortable: false,
    cell: (row) => (
     (row.repositoryName || row.repository ? <div className="full-w flex-center">
        {row.repositoryName || row.repository} {row.branch && `(${row.branch})`}
      </div> : (
        <img src="tables/line.svg" alt="null" className="table-null icon"/>
      )
    )),
    width: "25%",
  };


  const columns = [
    {
      key: "name",
      header: t("name"),
      sortable: true,
      width: "25%",
    },
    {
      key: "version",
      header: t("version"),
      sortable: true,
      width: "10%",
    },
    {
      key: "url",
      header: t("url"),
      sortable: true,
      width: "40%",
    },
    sourceCell,
  ];

  const desktopMenuActions = [
    {
      label: t("build"),
      onClick: (row) => {
        setAdvancedForm("");
      },
    },
    {
      label: t("edit"),
      onClick: (row) => {
        setFormObject(row);
        setAdvancedForm("editImage", row);
      },
    },
    {
      label: t("delete"),
      onClick: (row) => {
        if (!row?.id) return;
        deleteImage.mutate(
          { pathParams: { id: row.id } },
          {
            onError: (err) => {
              console.error("Error deleting image:", err);
            },
          }
        );
      },
    },
  ];

  return (
    <ResponsiveTable
      id="images"
      table_name="images"
      addFormName="addImage"
      searchKeys={["name", "url", "app", "repository_name", "branch", "version"]}
      columns={columns}
      initialData={images}
      // mobile: abre directamente el form de acciones
      mobileAction={(row) => {
        setFormObject(row);
        setAdvancedForm("actionsImage", row);
      }}
      // desktop: menú flotante
      desktopMenuTitle={t("image")}
      desktopMenuActions={desktopMenuActions}
    />
  );
}

export default ImagesPage;
