import { useEffect, useMemo, useState } from "react";
import RequestForm from "./components/RequestForm";
import CustomInput from "./components/CustomInput";
import CustomSelect from "./components/CustomSelect";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../context/PreferencesContext.jsx";
import { weightUnits } from "../..//features/livestock/livestockConsts.jsx";


export function FormSettings() {
  const { t } = useTranslation();
  const { weightUnit } = usePreferences();

  return (
    <RequestForm
      title={t("weighing") || "Weighing"}
      button_str={t("submit")}
      onSubmit={() => {}}
    >
    </RequestForm>
  );
}

export default FormSettings;
