// src/views/deployments/components/EditForm.jsx
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import CustomInput from "./CustomInput.jsx";
import CustomSelect from "./CustomSelect.jsx";
import { useAppState } from "../../../context/AppStateContext.jsx";

export default function EditForm({
  title,
  inputList,
  onSubmit,
  onRequestClose,
  onDelete,
  children,            // 👈 nuevo
}) {
  const { t } = useTranslation();
  const { formObject, setFormObject } = useAppState();
  const inputRefs = useRef([]);

  const handleChange = (key, value) => {
    setFormObject((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    await onSubmit?.(formObject);
    onRequestClose?.();
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
        handleSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="full-view column-left gap20 editForm"
    >
      <p className="h3 full-w">
        {`${t(title)} (${formObject?.name || ""})`}
      </p>

      {inputList?.length > 0 && (
        <div className="full-view column-left gap10">
          {inputList.map(
            (
              {
                label,
                valueKey,
                validations,
                inputType = "text",
                options = [],
                ...rest
              },
              index
            ) => {
              const value = formObject?.[valueKey] ?? "";

              if (inputType === "select") {
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
        </div>
      )}

      {children && (
        <div className="full-view column-left gap10">
          {children}
        </div>
      )}

      <div className="full-w row-right gap10">
        {/* si algún día quieres botón de borrar app/env, aquí encaja onDelete */}
        <button type="submit" className="hl1 h5">
          {t("update")}
        </button>
      </div>
    </form>
  );
}
