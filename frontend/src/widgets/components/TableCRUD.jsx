import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Table from "./Table";
import FullSearchBar from "./FullSearchBar";


export function TableCRUD({id, table_name, addFormName, searchKeys, columns, data,  setData, buttonName="add", onRowClick}) {
  const { t, ready } = useTranslation();

  const options = [{
      value: id,
      label: t(table_name),
      data: data,
      addFormName: addFormName,
      searchKeys: searchKeys,
  }]

  return (
    <div className="full-view flex column-left gap20">
        <p className="h3">{t(table_name)}</p>

        <FullSearchBar  
            options={options}
            setData={setData}
            buttonName={buttonName}
        />
        <Table
          data={data}
          columns={columns.filter(Boolean)}
          onRowClick={onRowClick}
        />    
    </div>
  );
}


export default TableCRUD;


