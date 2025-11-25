// src/views/deployments/forms/FormActionsApp.jsx
import { useAppState } from "../../../context/AppStateContext.jsx";
import {
  useUpdateApp,
  useDeleteApp,
} from "../../../features/deployments/apps/hooks.js";
import ActionsForm from "../components/ActionForm.jsx";

export default function FormActionsApp({ onRequestClose }) {
  const { formObject } = useAppState();

  const updateApp = useUpdateApp();
  const deleteApp = useDeleteApp();

  const inputList = [
    { label: "name", valueKey: "name" },
    { label: "domain", valueKey: "domain" },
    { label: "image", valueKey: "image" },
    // si luego quieres, aquí podrías mostrar locations como JSON o similar
  ];

  const handleSubmit = () => {
    if (!formObject?.id) return;

    updateApp.mutate(
      {
        pathParams: { id: formObject.id },
        req: formObject,
      },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
      }
    );
  };

  const deleteAppFn = () => {
    if (!formObject?.id) return;

    deleteApp.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
        onError: (err) => {
          console.error("Delete app failed:", err);
        },
      }
    );
  };

  return (
    <ActionsForm
      title="app"
      inputList={inputList}
      onSubmit={handleSubmit}
      onDelete={deleteAppFn}
      onRequestClose={onRequestClose}
    />
  );
}
