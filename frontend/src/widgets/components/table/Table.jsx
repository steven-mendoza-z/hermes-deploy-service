// src/widgets/components/Table.jsx
import { useMemo, useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Generic table with:
 * - sorting
 * - selected row
 * - custom cell render
 * - column width
 */
export default function Table({
  data = [],
  columns = [],
  initialSort = { key: null, direction: "asc" },
  getRowKey = (_, i) => i,
  onRowClick,        // click en fila no seleccionada
  onSelectedClick,   // click en fila ya seleccionada
  onDeselect,        // click fuera de la tabla
  striped = true,
  className = "",
}) {
  const { t } = useTranslation();
  const tableRef = useRef(null);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [selectedKey, setSelectedKey] = useState(null);

  // 🔹 Cerrar selección (y menú) al hacer click FUERA de la tabla
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!tableRef.current) return;
      if (!tableRef.current.contains(e.target)) {
        setSelectedKey(null);
        onDeselect?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onDeselect]);

  const requestSort = (key, sortable) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const col = columns.find((c) => c.key === sortConfig.key);
    if (!col) return data;

    const getValue = (row) =>
      col.accessor ? col.accessor(row) : row[col.key];

    return [...data].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      if (va == null && vb != null) return -1;
      if (va != null && vb == null) return 1;
      if (va == null && vb == null) return 0;

      if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
      if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortConfig]);

  const SortIcon = ({ active, direction }) => {
    if (!active) return null;
    return (
      <img
        src={
          direction === "asc"
            ? "/livestock_table/up.svg"
            : "/livestock_table/down.svg"
        }
        alt={direction === "asc" ? "ascending" : "descending"}
        className="sort-icon"
      />
    );
  };

  if (!data.length && sortConfig.key) {
    return (
      <div className={`full-view flex-center ${className}`}>
        <p className="empty-table-message h4">
          {t("emptyTableMessage")}
        </p>
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className={`full-view flex-center ${className}`}>
        <p className="empty-table-message h4">
          {t("noResultMessage")}
        </p>
      </div>
    );
  }

  return (
    <div className={`full-view ${className}`} ref={tableRef}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sortConfig.key === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => requestSort(col.key, col.sortable)}
                  className={col.sortable ? "th-sortable" : ""}
                  style={{
                    cursor: col.sortable ? "pointer" : "default",
                    width: col.width || "auto",
                  }}
                >
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                    className="row gap5"
                  >
                    {col.header}
                    <SortIcon
                      active={active}
                      direction={sortConfig.direction}
                    />
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => {
            const rowKey = getRowKey(row, idx);
            const baseRowClass =
              striped && idx % 2 === 0 ? "row-even" : "row-odd";
            const isSelected = selectedKey === rowKey;

            return (
              <tr
                key={rowKey}
                className={`${baseRowClass} ${
                  isSelected ? "row-selected" : ""
                }`}
                onClick={(e) => {
                  if (isSelected) {
                    // segundo click en la misma fila
                    onSelectedClick?.(row, e);
                  } else {
                    setSelectedKey(rowKey);
                    onRowClick?.(row, e);
                  }
                }}
                // 👇 doble click NO hace nada especial
                onDoubleClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  cursor:
                    onRowClick || onSelectedClick ? "pointer" : "default",
                }}
              >
                {columns.map((col) => {
                  if (col.cell) {
                    return (
                      <td
                        key={col.key}
                        className={col.className}
                        style={{ width: col.width || "auto" }}
                      >
                        {col.cell(row)}
                      </td>
                    );
                  }

                  const rawValue = col.accessor
                    ? col.accessor(row)
                    : row[col.key];
                  const displayValue =
                    rawValue === null ||
                    rawValue === undefined ||
                    rawValue === "" ? (
                      <img
                        alt="no value"
                        src="line.png"
                        className="table-null icon"
                      />
                    ) : (
                      rawValue
                    );

                  return (
                    <td
                      key={col.key}
                      className={col.className}
                      style={{ width: col.width || "auto" }}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
