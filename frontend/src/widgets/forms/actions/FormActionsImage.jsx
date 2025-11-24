import { useEffect, useState } from "react";
import RequestForm from "../components/RequestForm.jsx";
import CustomInput from "../components/CustomInput.jsx";
import CustomSelect from "../components/CustomSelect.jsx";

import { useTranslation } from "react-i18next";
import { RepoModel } from "../../../features/deployments/repos/RepoModel.js";
import { useCreateRepo } from "../../../features/deployments/repos/hooks.js";
import { useAppState } from "../../../context/AppStateContext.jsx";

export function FormActionsImage() {
  const { t } = useTranslation();
  const { setForm } = useAppState();

  const [repo, setRepo] = useState(new RepoModel());

  const handleChange = (field, value) => {
    const updated = new RepoModel(repo.toJSON());
    updated[field] = value;
    setRepo(updated);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[FormActionsImage] submit fired");
    try {
        // API request
      const response = await useCreateRepo(repo);
      console.log("Responose:", response);

    // Cleaning Form
      const reset = new RepoModel();
      setRepo(reset);
      setForm("none");

    } catch (error) {
      console.error("Error", error.response?.data || error.message);
    }
  };

  return (
    <RequestForm
      title={t("addRepo")}
      button_str={t("submit")}
      onSubmit={handleSubmit}
    >
    
    </RequestForm>
  );
}

export default FormActionsImage;
