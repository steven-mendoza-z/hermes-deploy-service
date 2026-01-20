import { useTranslation } from "react-i18next";
import { useRef } from "react";
import CustomInput from "../components/CustomInput.jsx";
import CustomSelect from "../components/CustomSelect.jsx";

export default function RequestForm({
  title,
  inputList,
  formObject,
  handleChange,
  onSubmit,
  button_str,
  children,
}) {
  const { t } = useTranslation();
  const inputRefs = useRef([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const nextIndex = index + 1;
      const nextInput = inputRefs.current[nextIndex];

      if (nextInput) {
        nextInput.focus();
        if (typeof nextInput.select === "function") {
          nextInput.select();
        }
      } else {
        // último input → submit del form
        handleFormSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="full-view column-left gap30 requestForm"
    >
      <p className="h3 full-w">{title}</p>

      <div className="full-view column-left gap20">
        {inputList.map(
          (
            {
              label,
              valueKey,
              validations,
              inputType = "text", // por defecto text
              options = [],
              ...rest
            },
            index
          ) => {
            const value = formObject?.[valueKey] ?? "";

            if (inputType === "select") {
              // Render Select
              return (
                <CustomSelect
                  key={valueKey}
                  label={t(label)}
                  options={options}
                  value={value}
                  onChange={(v) => handleChange(valueKey, v)}
                  {...rest}
                />
              );
            }

            // Render Input normal
            return (
              <CustomInput
                key={valueKey}
                label={t(label)}
                placeholder={t(label)}
                value={value}
                onChange={(v) => handleChange(valueKey, v)}
                validations={validations}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                {...rest}
              />
            );
          }
        )}

        {children}
      </div>

      <div className="full-w row-right">
        <button type="submit" className="hl1 h5">
          {button_str || t("submit")}
        </button>
      </div>
    </form>
  );
}
