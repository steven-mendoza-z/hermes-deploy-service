import { useEffect, useMemo, useRef, useState } from "react";
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

  // snapshot por opción
  const fullDataMapRef = useRef(new Map());
  const lastSigRef = useRef({ opt: null, q: "", len: -1, firstKey: undefined });

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

    const full = fullDataMapRef.current.get(current.value) || [];
    const next = q ? full.filter((row) => rowMatches(row, q)) : full;

    const sig = {
      opt: current.value,
      q,
      len: next.length,
      firstKey: next.length ? Object.values(next[0])[0] : undefined,
    };
    const prev = lastSigRef.current;
    if (
      prev.opt === sig.opt &&
      prev.q === sig.q &&
      prev.len === sig.len &&
      prev.firstKey === sig.firstKey
    ) {
      return; // mismo resultado → no setData → evitamos loops
    }
    lastSigRef.current = sig;
    setData(next);
  };

  // 1) Guardar snapshot de la data completa cuando cambia el dataset
  useEffect(() => {
    if (!current) return;

    const fullMap = fullDataMapRef.current;
    const existing = fullMap.get(current.value);
    const base = Array.isArray(current.data) ? current.data : [];

    // Solo inicializamos snapshot si no existe todavía y ya hay data
    if ((!existing || !existing.length) && base.length) {
      fullMap.set(current.value, [...base]);
      // opcional: inicializar data visible con el full
      setData(base);
      lastSigRef.current = { opt: null, q: "", len: -1, firstKey: undefined };
    }
  }, [current, setData]);

  // 2) Aplicar filtro con debounce
  useEffect(() => {
    applyFilter(debouncedQuery);
  }, [debouncedQuery, current]);

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
          onChange={(e) => setQuery(e.target.value)}  // solo actualiza query
          onKeyDown={(e) => e.key === "Enter" && applyFilter(query)} // enter = filtro inmediato
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
