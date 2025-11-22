import { useEffect, useState } from "react";
import RequestForm from "../components/RequestForm.jsx";
import CustomInput from "../components/CustomInput.jsx";
import CustomSelect from "../components/CustomSelect.jsx";

import {
  useSpecies,
  useSex,
  useOwners,
  useLocations,
  useOrigins,
  weightUnits,
} from "../../features/livestock/livestockConsts.jsx";

import { useTranslation } from "react-i18next";
import { usePreferences } from "../../../context/PreferencesContext.jsx";

import { LivestockModel } from "../../features/livestock/entities/models/LivestockModel.jsx";
import { addLivestock } from "../../features/livestock/hooks/livestockRequests.js";
import { useAppState } from "../../../context/AppStateContext.jsx";

export function FormAddLivestock() {
  const { t } = useTranslation();
  const { weightUnit } = usePreferences();
  const { setForm } = useAppState();


  // Instancia del objeto LivestockModel
  const [livestock, setLivestock] = useState(new LivestockModel({ weightUnit }));

  // Hooks para opciones
  const speciesOptions = useSpecies();
  const sexOptions = useSex();
  const ownerOptions = useOwners();
  const originOptions = useOrigins();
  const locationOptions = useLocations();

  // Monedas
  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "NIO", label: "NIO" },
  ];

  // Maneja cualquier cambio
  const handleChange = (field, value) => {
    const updated = new LivestockModel(livestock.toJSON());
    updated[field] = value;
    setLivestock(updated);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[FormAddLivestock] submit fired");
    try {
      // 🧩 Llamada real a la API
      const response = await addLivestock(livestock);

      console.log("✅ Livestock creado:", response);

      // (Opcional) limpiar formulario
      const reset = new LivestockModel({ weightUnit });
      setLivestock(reset);

      // Mostrar feedback al usuario (puedes usar un toast o alert)
      alert(t("livestockAddedSuccess"));
      setForm("none");
    } catch (error) {
      console.error("❌ Error al crear Livestock:", error.response?.data || error.message);
      alert(t("livestockAddError"));
    }
  };

  return (
    <RequestForm
      title={t("addLivestock")}
      button_str={t("submit")}
      onSubmit={handleSubmit}
    >
      {/* Sección 1 */}
      <div className="formSection">
        <CustomInput
          label={t("id")}
          placeholder={t("idPlaceholder")}
          value={livestock.idTag}
          onChange={(v) => handleChange("idTag", v)}
        />

        <CustomSelect
          label={t("specie")}
          placeholder={t("speciePlaceholder")}
          value={livestock.specie}
          required
          onChange={(v) => handleChange("specie", v)}
          options={speciesOptions}
        />

        <CustomSelect
          label={t("sex")}
          placeholder={t("sexPlaceholder")}
          value={livestock.sex}
          required
          onChange={(v) => handleChange("sex", v)}
          options={sexOptions}
        />

        <CustomSelect
          label={t("originType")}
          placeholder={t("originPlaceholder")}
          value={livestock.origin}
          onChange={(v) => handleChange("origin", v)}
          options={originOptions}
        />
      </div>

      {/* Sección 2 */}
      <div className="formSection">
        <CustomSelect
          label={t("currentOwner")}
          placeholder={t("currentOwnerPlaceholder")}
          value={livestock.owner}
          required
          onChange={(v) => handleChange("owner", v)}
          options={ownerOptions}
        />

        {livestock.origin === "purchase" && (
          <div className="column full-w">
            <CustomSelect
              label={t("previousOwner")}
              placeholder={t("previousOwnerPlaceholder")}
              value={livestock.previousOwner}
              onChange={(v) => handleChange("previousOwner", v)}
              options={ownerOptions}
            />

            <div className="row full-w gap5">
              <CustomInput
                label={t("purchaseValue")}
                placeholder={t("purchaseValuePlaceholder")}
                value={livestock.purchaseValue}
                onChange={(v) => handleChange("purchaseValue", v)}
                type="number"
              />
              <CustomSelect
                label={t("currency")}
                placeholder={t("currencyPlaceholder")}
                value={livestock.purchaseCurrency}
                onChange={(v) => handleChange("purchaseCurrency", v)}
                options={currencyOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sección 3 */}
      <div className="formSection">
        <CustomSelect
          label={t("location")}
          placeholder={t("locationPlaceholder")}
          value={livestock.location}
          onChange={(v) => handleChange("location", v)}
          options={locationOptions}
        />

        <CustomInput
          label={t("birthdate")}
          placeholder={t("birthdatePlaceholder")}
          value={livestock.birthdate}
          onChange={(v) => handleChange("birthdate", v)}
          type="date"
        />

        <div className="row full-w gap5">
          <CustomInput
            label={t("weight")}
            placeholder={t("weightPlaceholder")}
            value={livestock.weight}
            onChange={(v) => handleChange("weight", v)}
            type="number"
          />
          <CustomSelect
            label={t("unit")}
            placeholder={t("unitPlaceholder")}
            value={livestock.weightUnit}
            onChange={(v) => handleChange("weightUnit", v)}
            options={weightUnits}
          />
        </div>
      </div>

      {/* Tags */}
      <CustomInput
        label={t("tags")}
        placeholder={t("tagsPlaceholder")}
        value={livestock.tags}
        onChange={(v) => handleChange("tags", v)}
      />
    </RequestForm>
  );
}

export default FormAddLivestock;
