import { useState } from "react";
import RequestForm from "../components/RequestForm.jsx";
import { useTranslation } from "react-i18next";
import { ServerModel } from "../../../features/deployments/servers/ServerModel.js";
import { useCreateServer, useServers } from "../../../features/deployments/servers/hooks.js";

export function FormAddServer({ onRequestClose }) {
  const { t } = useTranslation();
  const [server, setServer] = useState(new ServerModel());
  const createServer = useCreateServer();


  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "ipAddress", valueKey: "ip", validations: { required: true, pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" } },
    { label: "region", valueKey: "region", validations: { required: true } },
    { label: "email", valueKey: "email", validations: { type: "email", required: true } },
    { label: "projectId", valueKey: "project", validations: { required: true } },
  ];

  const handleChange = (key, value) => {
    const updated = new ServerModel(server.toJSON()); // nueva instancia
    updated[key] = value;                              // aplicar cambio
    setServer(updated);                                // actualizar estado
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createServer.mutate(
  { req: server.toAddPayload() }, // o toEditPayload()
  {
    onSuccess: () => {
      setServer(new ServerModel());
      onRequestClose?.();
    },
    onError: (err) => console.error(err.response?.data || err.message),
  }
);

  };


  return (
    <RequestForm
      title={t("addServer")}
      button_str={t("submit")}
      inputList={inputList}
      formObject={server}
      setFormObject={setServer}
      handleChange={handleChange}  // <-- aquí la prop se llama "onChange"
      onSubmit={handleSubmit}
    />

  );
}

export default FormAddServer;
