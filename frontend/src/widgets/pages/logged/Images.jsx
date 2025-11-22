import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableCRUD from "../../components/TableCRUD";
import { useImages } from "../../../features/deployments/images/hooks";

export function ImagesPage() {
  const { t } = useTranslation();

  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useImages();

  // const images = [
  //   { 
  //     name: "Image 1", 
  //     version: "v0.2.1", 
  //     url: "https://example.com/image1", 
  //     repository: "Repo 1" 
  //   },
  // ];


  const [data, setData] = useState(images);
  console.log("Servers fetched:", images);
  useEffect(() => {
    setData(images);
  }, [!isLoading]);


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
        data={data}
        setData={setData}
      />
    </div>
  );
}

export default ImagesPage;
