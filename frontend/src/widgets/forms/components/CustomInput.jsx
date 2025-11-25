import { useTranslation } from "react-i18next";

export function CustomInput({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  validations = {}, // <-- nuevo
  className = "",
  labelClassName = "",
  fieldClassName = "",
}) {
  const { t } = useTranslation();
  
  return (
    <div className={`customField ${className}`}>
      {label && (
        <label className={`customField-label row-left ${labelClassName}`}>
          {label}
          {validations.required && <span className="requiredMark">*  </span>}
          {validations.required && <span className="requiredText">({t("required")})</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...validations} // <-- aplica todas las validaciones del input
        className={`customInput ${fieldClassName}`}
      />
    </div>
  );
}

export default CustomInput;
