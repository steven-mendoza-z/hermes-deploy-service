import { useAppState } from "../../../context/AppStateContext.jsx";
import ActionsForm from "../components/ActionsForm.jsx";
import { useDeleteRepo } from "../../../features/deployments/repos/hooks";

export default function FormActionsRepo({ onRequestClose }) {
  const { formObject, setAdvancedForm } = useAppState();
  const deleteRepo = useDeleteRepo();

  const handleDelete = () => {
    if (!formObject?.id) return;

    deleteRepo.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          console.log("Repo deleted:", formObject.id);
          onRequestClose?.();  // cerrar modal si existe
        },
        onError: (err) => {
          console.error("Error deleting repo:", err);
        },
      }
    );
  };

  const actions = [
    {
      label: "delete",
      onClick: handleDelete,
      icon: "delete2.png",
      color: ""
    },
    {
      label: "edit",
      onClick: () => setAdvancedForm("editRepo", formObject),
      icon: "edit.png",
      color: ""
    },
  ];

  return <ActionsForm actions={actions} />;
}
