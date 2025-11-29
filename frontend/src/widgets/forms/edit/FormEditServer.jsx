import { useEffect } from "react";
import { useAppState } from "../../../context/AppStateContext.jsx";
import { useDeleteServer, useUpdateServer } from "../../../features/deployments/servers/hooks.js";
import EditForm from "../components/EditForm.jsx";

export default function FormEditServer({ onRequestClose }) { 
  const { formObject, setFormObject } = useAppState();

  const updateServer = useUpdateServer();
  const deleteServer = useDeleteServer();

  const inputList = [
    { label: "name", valueKey: "name" },
    { label: "ipAddress", valueKey: "ip" },
    { label: "region", valueKey: "region" },
    { label: "email", valueKey: "email" },
    { label: "projectId", valueKey: "project" },
  ];

  const handleSubmit = () => {
    if (!formObject?.id) return;

    updateServer.mutate({
      pathParams: { id: formObject.id },
      req: formObject,
    }, {
      onSuccess: () => {
        onRequestClose?.();
      }
    });
  };

    const deleteServerFn = () => {
    if (!formObject?.id) return;

    deleteServer.mutate(
        { pathParams: { id: formObject.id } },
        {
        onSuccess: () => {
            onRequestClose?.();
        },
        onError: (err) => {
            console.error("Delete failed:", err);
        },
        }
    );
    };


  return (
    <EditForm
      title="server"
      inputList={inputList}
      onSubmit={handleSubmit}
      onDelete={deleteServerFn}
      onRequestClose={onRequestClose}
    />
  );
}
