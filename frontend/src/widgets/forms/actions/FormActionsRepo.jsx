// src/views/deployments/forms/FormActionsRepo.jsx
import { useAppState } from "../../../context/AppStateContext.jsx";
import {
  useUpdateRepo,
  useDeleteRepo,
} from "../../../features/deployments/repos/hooks.js";
import ActionsForm from "../components/ActionForm.jsx";

export default function FormActionsRepo({ onRequestClose }) {
  const { formObject } = useAppState();

  const updateRepo = useUpdateRepo();
  const deleteRepo = useDeleteRepo();

  const inputList = [
    { label: "name", valueKey: "name" },
    { label: "url", valueKey: "url" },
  ];

  const handleSubmit = () => {
    if (!formObject?.id) return;

    updateRepo.mutate(
      {
        pathParams: { id: formObject.id },
        req: formObject, // viene de la tabla, ya es un objeto plano
      },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
      }
    );
  };

  const deleteRepoFn = () => {
    if (!formObject?.id) return;

    deleteRepo.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
        onError: (err) => {
          console.error("Delete repo failed:", err);
        },
      }
    );
  };

  return (
    <ActionsForm
      title="repository"
      inputList={inputList}
      onSubmit={handleSubmit}
      onDelete={deleteRepoFn}
      onRequestClose={onRequestClose}
    />
  );
}
