import { useTranslation } from "react-i18next";
import CustomInput from "../components/CustomInput.jsx";
import { useAppState } from "../../../context/AppStateContext.jsx";
import { useState, useEffect } from "react";

export default function ActionsForm({ title, inputList, onSubmit }) {
  const { t } = useTranslation();
  const { formObject, setFormObject } = useAppState();

  const handleChange = (key, value) => {
    setFormObject(prev => ({ ...prev, [key]: value }));
  };

    const [object, setObject] = useState(formObject); // solo inicial

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
        await onSubmit(object); // ahora sí será el valor actualizado del local state
    }
    };


  return (
    <form onSubmit={handleSubmit} className="full-view column-left gap30">
      <p className="h3">{`${t(title)} (${formObject?.name || ""})`}</p>

      <div className="full-w column-left gap10">
        {inputList.map(({ label, valueKey }) => (
          <CustomInput
            key={valueKey}
            label={t(label)}
            placeholder={t(label)}
            value={formObject?.[valueKey] || ""}
            onChange={(v) => handleChange(valueKey, v)}
          />
        ))}
      </div>

      <div className="full-w row-right">
        <button type="submit" className="hl1">
          {t("update")}
        </button>
      </div>
    </form>
  );
}
