// src/views/deployments/forms/FormAddRepo.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RequestForm from "../components/RequestForm.jsx";
import { RepoModel } from "../../../features/deployments/repos/RepoModel.js";
import { useCreateRepo } from "../../../features/deployments/repos/hooks.js";

export function FormAddRepo({ onRequestClose }) {
  const { t } = useTranslation();
  const [repo, setRepo] = useState(new RepoModel());
  const createRepo = useCreateRepo();

  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "url", valueKey: "url", validations: { required: true, type: "url" } },
  ];

  const handleChange = (key, value) => {
    const updated = new RepoModel(repo.toJSON());
    updated[key] = value;
    setRepo(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRepo.mutate(
      { req: repo.toAddPayload() },
      {
        onSuccess: () => {
          setRepo(new RepoModel());
          onRequestClose?.();
        },
        onError: (err) => {
          console.error(err?.response?.data || err?.message);
        },
      }
    );
  };

  return (
    <RequestForm
      title={t("addRepository")}
      button_str={t("submit")}
      inputList={inputList}
      formObject={repo}
      setFormObject={setRepo}
      handleChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default FormAddRepo;
