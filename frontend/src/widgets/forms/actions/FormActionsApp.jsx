import { useAppState } from "../../../context/AppStateContext.jsx";
import ActionsForm from "../components/ActionsForm.jsx";
import { useDeleteApp } from "../../../features/deployments/apps/hooks";

export default function FormActionsApp({ onRequestClose }) {
  const { formObject, setAdvancedForm } = useAppState();
  const deleteApp = useDeleteApp();

  const handleDelete = () => {
    if (!formObject?.id) return;

    deleteApp.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          console.log("App deleted:", formObject.id);
          onRequestClose?.();
        },
        onError: (err) => {
          console.error("Error deleting app:", err);
        },
      }
    );
  };

  const actions = [
    {
      label: "delete",
      onClick: handleDelete,
      icon: "delete2.png",
      color: "",
    },
    {
      label: "edit",
      onClick: () => setAdvancedForm("editApp", formObject),
      icon: "edit.png",
      color: "",
    },
    {
      label: "deploy",
      onClick: handleDelete,
      icon: "cloud.png",
      color: "",
    },
  ];

  return <ActionsForm actions={actions} />;
}
