import { useTranslation } from "react-i18next";

export default function CustomSelect({
  label,
  placeholder = "Select an option",
  value,
  defaultValue = "",
  onChange,
  options = [],
  required = false,
  className = "", 
  labelClassName = "",
  fieldClassName = "",
}) {
    const { t } = useTranslation();
  
  return (
    <div className={`customField ${className}`}>
      {label && (
        <label className={`customField-label t-body5 ${labelClassName}`}>
          {t(label)}
          {required && <span className="requiredText">{t("required")}</span>}
        </label>
      )}

      <select
        value={value ?? defaultValue}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`customSelect ${fieldClassName} ${!value ? "placeholder" : ""}`}
      >
        <option value="" disabled hidden className="placeholder">
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
