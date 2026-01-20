import { useAppState } from "../../../context/AppStateContext.jsx";
import ActionsForm from "../components/ActionsForm.jsx";
import { useDeleteServer } from "../../../features/deployments/servers/hooks";

export default function FormActionsServer({ onRequestClose }) {
  const { formObject, setAdvancedForm, setOpenTerminal } = useAppState();
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
      icon: "actions/delete.svg",
      color: "",
    },
    {
      label: "setup",
      onClick: () => setAdvancedForm("sshCmd", formObject),
      icon: "nav/settings.svg",
      color: "",
    },
    {
      label: "edit",
      onClick: () => setAdvancedForm("editServer", formObject),
      icon: "actions/edit.svg",
      color: "",
    },
    {
      label: "openTerminal",
      onClick: () => {
        setAdvancedForm("", null),
        setOpenTerminal(true)
      },
      icon: "actions/terminal.svg",
      color: "green",
    },
  ];

  return <ActionsForm actions={actions} />;
}
