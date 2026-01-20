// src/views/deployments/forms/FormAddApp.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RequestForm from "../components/RequestForm.jsx";
import { AppModel } from "../../../features/deployments/apps/AppModel.js";
import { useCreateApp } from "../../../features/deployments/apps/hooks.js";
import CustomSelect from "../components/CustomSelect.jsx";
import { useRepos } from "../../../features/deployments/repos/hooks.js";
import { useServers } from "../../../features/deployments/servers/hooks.js";

export function FormAddApp({ onRequestClose }) {
  const { t } = useTranslation();
  const [app, setApp] = useState(new AppModel());
  const createApp = useCreateApp();

  const { data: repos = [] } = useRepos();
  const repoOptions = Array.isArray(repos)
    ? repos.map((r) => ({
        value: r.id,
        label: r.name,
      }))
    : [];
  const { data: servers = [] } = useServers();
  const serverOptions = servers.map((s) => ({
    value: s.id,
    label: s.name || s.ip,
  }));

  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "domain", valueKey: "domain", validations: { required: true } },
    { label: "repository", valueKey: "repo", inputType: "select", options: repoOptions, required: true, validations: { required: true },},
    { label: "branch", valueKey: "branch", validations: { required: true } },
    { label: "server", valueKey: "server", inputType: "select", required: true, options: serverOptions },
  ];

  const handleChange = (key, value) => {
    const updated = new AppModel(app.toJSON());
    updated[key] = value;
    setApp(updated);
  };

  const handleSubmit = () => {
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
      title={t("createApp")}
      button_str={t("submit")}
      inputList={inputList}
      formObject={app}
      setFormObject={setApp}
      handleChange={handleChange}
      onSubmit={handleSubmit}
    >
    </RequestForm>
  );
}

export default FormAddApp;
