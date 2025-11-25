import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../context/AppStateContext";
import { useTranslation } from "react-i18next";
import CustomSelect from "../forms/components/CustomSelect";

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function FullSearchBar({
  options = [],
  selectedOption,
  onChangeOption,
  setData,
  initialQuery = "",
  filters = false,
  buttonName = "add",
}) {
  const { t } = useTranslation();
  const { setForm } = useAppState();
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 250);

  const current = useMemo(() => {
    const found = options.find((o) => o.value === selectedOption);
    return found ?? options[0] ?? null;
  }, [options, selectedOption]);

  const searchKeys = useMemo(() => {
    if (!current) return ["name", "label"];
    return current.searchKeys?.length ? current.searchKeys : ["name", "label"];
  }, [current]);

  const rowMatches = (row, q) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    for (const key of searchKeys) {
      const val = row?.[key];
      if (val != null && String(val).toLowerCase().includes(needle)) return true;
    }
    for (const v of Object.values(row || {})) {
      if (typeof v === "string" && v.toLowerCase().includes(needle)) return true;
    }
    return false;
  };

  const applyFilter = (q) => {
    if (!current || typeof setData !== "function") return;

    const full = Array.isArray(current.data) ? current.data : [];
    const next = q ? full.filter((row) => rowMatches(row, q)) : full;

    // 👇 importante: solo actualizar si realmente cambia el contenido
    setData((prev) => {
      if (
        prev.length === next.length &&
        prev.every((row, i) => row === next[i])
      ) {
        return prev; // evita re-render → evita loop
      }
      return next;
    });
  };

  useEffect(() => {
    applyFilter(debouncedQuery);
  }, [debouncedQuery, current]); // está bien que cambie: si el contenido es el mismo, setData no hará nada

  const handleOptionChange = (val) => onChangeOption?.(val);
  const handleAdd = () => current?.addFormName && setForm(current.addFormName);

  return (
    <div className="full-view flex row gap10">
      {options.length > 1 && (
        <CustomSelect
          value={current?.value || ""}
          onChange={handleOptionChange}
          options={options.map(({ value, label }) => ({ value, label }))}
          placeholder="Select dataset"
          className="searchbar-select"
        />
      )}

      <div className="full-view searchbar">
        <input
          type="text"
          className="searchbar-input"
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilter(query)}
        />
        <button className="searchbar-button" onClick={() => applyFilter(query)}>
          <img src="./search.png" alt="" className="icon" />
        </button>
      </div>

      {filters && (
        <button className="searchbar-filter row center">
          <img src="./filter.png" alt="filter" className="icon" />
          <p>Filters</p>
        </button>
      )}
      {current?.addFormName && (
        <button className="searchbar-add row center" onClick={handleAdd}>
          <img src="./add.png" alt="add" className="reversed-icon" />
          <p>{t(buttonName)}</p>
        </button>
      )}
    </div>
  );
}
