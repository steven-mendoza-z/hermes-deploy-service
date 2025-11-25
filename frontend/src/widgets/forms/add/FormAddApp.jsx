// src/views/deployments/forms/FormAddApp.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RequestForm from "../components/RequestForm.jsx";
import { AppModel } from "../../../features/deployments/apps/AppModel.js";
import { useCreateApp } from "../../../features/deployments/apps/hooks.js";

export function FormAddApp({ onRequestClose }) {
  const { t } = useTranslation();
  const [app, setApp] = useState(new AppModel());
  const createApp = useCreateApp();

  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "domain", valueKey: "domain", validations: { required: true } },
    { label: "image", valueKey: "image", validations: { required: true } },
    // locations las podríamos manejar más adelante con UI dedicada
  ];

  const handleChange = (key, value) => {
    const updated = new AppModel(app.toJSON());
    updated[key] = value;
    setApp(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createApp.mutate(
      { req: app.toAddPayload() },
      {
        onSuccess: () => {
          setApp(new AppModel());
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
      title={t("addApp")}
      button_str={t("submit")}
      inputList={inputList}
      formObject={app}
      setFormObject={setApp}
      handleChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default FormAddApp;
