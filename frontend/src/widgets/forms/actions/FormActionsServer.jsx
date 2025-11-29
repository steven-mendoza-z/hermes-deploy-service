import { useAppState } from "../../../context/AppStateContext.jsx";
import ActionsForm from "../components/ActionsForm.jsx";
import { useDeleteServer } from "../../../features/deployments/servers/hooks";

export default function FormActionsServer({ onRequestClose }) {
  const { formObject, setAdvancedForm } = useAppState();
  const deleteServer = useDeleteServer();

  const handleDelete = () => {
    if (!formObject?.id) return;

    deleteServer.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          console.log("Server deleted:", formObject.id);
          onRequestClose?.();
        },
        onError: (err) => {
          console.error("Error deleting server:", err);
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
      onClick: () => setAdvancedForm("editServer", formObject),
      icon: "edit.png",
      color: "",
    },
    {
      label: "terminal",
      onClick: () => setAdvancedForm("editServer", formObject),
      icon: "terminal.png",
      color: "green",
    },
  ];

  return <ActionsForm actions={actions} />;
}
