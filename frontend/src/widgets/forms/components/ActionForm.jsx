import { useTranslation } from "react-i18next";
import CustomInput from "../components/CustomInput.jsx";
import { useAppState } from "../../../context/AppStateContext.jsx";

export default function ActionsForm({ title, inputList, onSubmit, onDelete, onRequestClose }) {
  const { t } = useTranslation();
  const { formObject, setFormObject } = useAppState();

  const handleChange = (key, value) => {
    setFormObject(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.(formObject);   // AHORA ENVÍA EL OBJETO ACTUALIZADO
    onRequestClose?.();
  };

    const onDeleteFlow = (e) => {
    e.preventDefault(); // evitar submit accidental
    console.log("Deleting: ", formObject);
    onDelete?.(); // solo llamamos al handler, sin cerrar
    };



  return (
    <form onSubmit={handleSubmit} className="full-view column-left gap20 actionsForm">
      <p className="h3 full-w">{`${t(title)} (${formObject?.name || ""})`}</p>

      <div className="full-view column-left gap10">
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

      <div className="full-w row-right gap10">
        <button type="button" className="hl1 h5 off" onClick={onDeleteFlow}>
          {t("delete")}
        </button>
        <button type="submit" className="hl1 h5">
          {t("update")}
        </button>
      </div>
    </form>
  );
}
